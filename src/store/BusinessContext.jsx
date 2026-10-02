import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { businessApi } from "../services/businessApi.js";
import { useAuth } from "./AuthContext.jsx";
import { isValidSlug, uid, PLATFORM_URL } from "../utils/businessUtils.js";

/**
 * Global business store.
 * Thin orchestration layer over services/businessApi.js — when the Express +
 * MongoDB backend lands, only the service file changes, not this context.
 * (If the app grows, this swaps cleanly for Redux Toolkit's createSlice.)
 */
const BusinessContext = createContext(null);

export function BusinessProvider({ children }) {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState({});
  const [ready, setReady] = useState(false);

  /* Reload whenever the session changes so ownership data stays accurate. */
  useEffect(() => {
    let alive = true;
    businessApi
      .list()
      .then((map) => alive && setBusinesses(map))
      .catch(() => alive && setBusinesses({}))
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [user?.id]);

  const getBySlug = useCallback((slug) => businesses[slug] || null, [businesses]);

  const createBusiness = useCallback(async (data) => {
    if (!data.name?.trim()) return { ok: false, error: "Please enter your business name." };
    if (!isValidSlug(data.slug))
      return { ok: false, error: "That link is invalid or reserved. Use lowercase letters, numbers and dashes." };
    const existing = await businessApi.get(data.slug);
    if (existing) return { ok: false, error: `${PLATFORM_URL}/${data.slug} is already taken — try a different link.` };
    if (!user) return { ok: false, error: "Please sign in to publish a website." };
    /* Super-admin-created websites are payment-exempt and go live instantly. */
    const isSuperAdminSite = user.role === "superadmin";

    const record = {
      ...data,
      id: data.id || uid(),
      published: isSuperAdminSite,
      paymentExempt: isSuperAdminSite,
      paymentExemptReason: isSuperAdminSite ? "superadmin_creation" : "",
      paymentExemptAt: isSuperAdminSite ? new Date().toISOString() : null,
      // Ownership + creator audit trail (the API re-stamps these from the JWT).
      owner: user.id,
      ownerName: user.name,
      ownerEmail: user.email,
      createdBy: user.id,
      createdByName: user.name,
      createdByEmail: user.email,
      createdByRole: user.role,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      const saved = await businessApi.create(record);
      setBusinesses((m) => ({ ...m, [saved.slug]: saved }));
      return { ok: true, business: saved };
    } catch (err) {
      return { ok: false, error: err.message || "Could not save — is the API reachable?" };
    }
  }, [user]);

  const updateBusiness = useCallback(async (originalSlug, data) => {
    if (!isValidSlug(data.slug)) return { ok: false, error: "That link is invalid or reserved." };
    if (data.slug !== originalSlug) {
      const clash = await businessApi.get(data.slug);
      if (clash) return { ok: false, error: `${PLATFORM_URL}/${data.slug} is already taken.` };
    }
    const record = { ...data, slug: data.slug, updatedAt: new Date().toISOString() };
    try {
      const saved = await businessApi.update(originalSlug, record);
      setBusinesses((m) => {
        const next = { ...m };
        if (originalSlug !== saved.slug) delete next[originalSlug];
        next[saved.slug] = saved;
        return next;
      });
      return { ok: true, business: saved };
    } catch (err) {
      return { ok: false, error: err.message || "Could not save changes — is the API reachable?" };
    }
  }, []);

  const deleteBusiness = useCallback(async (slug) => {
    try {
      await businessApi.remove(slug);
      setBusinesses((m) => {
        const next = { ...m };
        delete next[slug];
        return next;
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  const togglePublished = useCallback(
    async (slug) => {
      const b = businesses[slug];
      if (!b) return { ok: false, error: "Website not found." };
      /* Publishing needs payment unless this site was created by the super admin. */
      const freeSite = b.paymentExempt || b.createdByRole === "superadmin";
      if (!b.published && !b.paid && !freeSite) {
        return { ok: false, paymentRequired: true, slug, error: "Payment required to publish this website." };
      }
      try {
        const saved = await businessApi.update(slug, { ...b, published: !b.published });
        setBusinesses((m) => ({ ...m, [slug]: saved }));
        return { ok: true, business: saved };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    },
    [businesses, user]
  );

  /** Re-read everything (used after a payment confirms so lists update). */
  const refresh = useCallback(async () => {
    try {
      setBusinesses(await businessApi.list());
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetDemo = useCallback(async () => {
    try {
      const map = await businessApi.resetDemo();
      setBusinesses(map);
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo(() => {
    const all = Object.values(businesses).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const owns = (b) => !!user && (b.owner === user.id || b.ownerEmail === user.email);
    return {
      businesses,
      ready,
      /** Every business on the platform (public directory / landing page). */
      list: all,
      /**
       * Websites the signed-in account may manage. Sites are private to their
       * creator — admin1 never sees admin2's work. Only the super admin
       * sees the whole platform.
       */
      myList: user ? (user.role === "superadmin" ? all : all.filter(owns)) : [],
      owns,
      getBySlug,
      createBusiness,
      updateBusiness,
      deleteBusiness,
      togglePublished,
      refresh,
      resetDemo,
    };
  }, [businesses, ready, user, getBySlug, createBusiness, updateBusiness, deleteBusiness, togglePublished, refresh, resetDemo]);

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusinesses() {
  return useContext(BusinessContext);
}
