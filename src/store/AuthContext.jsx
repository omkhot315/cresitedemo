import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, tokenStore, DEMO_ACCOUNTS } from "../services/authApi.js";

/**
 * Session store — JWT in REMOTE mode, simulated session in LOCAL demo mode.
 *
 * Role hierarchy (public sign-up creates owners only):
 *   superadmin → provisions admins, manages every account and website
 *   admin      → creates and manages only their own websites
 *   owner      → manages only their own websites
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  /* Restore a session on boot (validates the token against the API). */
  useEffect(() => {
    let alive = true;
    const token = tokenStore.get();
    if (!token) {
      setReady(true);
      return () => {
        alive = false;
      };
    }
    authApi
      .me(token)
      .then((u) => alive && setUser(u))
      .catch(() => {
        tokenStore.set(null);
        if (alive) setUser(null);
      })
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const { user: u, token } = await authApi.login(credentials);
      tokenStore.set(token);
      setUser(u);
      return { ok: true, user: u };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);

  /** Public sign-up — the API always returns an "owner" account. */
  const register = useCallback(async (payload) => {
    try {
      const { user: u, token } = await authApi.register(payload);
      tokenStore.set(token);
      setUser(u);
      return { ok: true, user: u };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);

  /**
   * Store a session that the API has already authenticated.
   * Used after a successful password reset, where `/reset-password` returns
   * a fresh `{ user, token }` so the user can continue without signing in again.
   */
  const establishSession = useCallback((session) => {
    if (!session?.user || !session?.token) {
      return { ok: false, error: "The server returned an invalid session." };
    }
    tokenStore.set(session.token);
    setUser(session.user);
    return { ok: true, user: session.user };
  }, []);

  const logout = useCallback(() => {
    tokenStore.set(null);
    setUser(null);
  }, []);

  /* ------------------- super-admin account provisioning ------------------- */
  const createUser = useCallback(
    async (payload) => {
      if (user?.role !== "superadmin") {
        return { ok: false, error: "Only the platform super admin can create accounts." };
      }
      try {
        const created = await authApi.createUser(payload);
        return { ok: true, user: created };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    },
    [user]
  );

  const updateUserRole = useCallback(
    async (id, role) => {
      if (user?.role !== "superadmin") {
        return { ok: false, error: "Only the platform super admin can change roles." };
      }
      try {
        const updated = await authApi.updateRole(id, role);
        return { ok: true, user: updated };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    },
    [user]
  );

  const deleteUser = useCallback(
    async (id) => {
      if (user?.role !== "superadmin") {
        return { ok: false, error: "Only the platform super admin can remove accounts." };
      }
      try {
        await authApi.deleteUser(id);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    },
    [user]
  );

  const value = useMemo(() => {
    const role = user?.role;
    const isSuperAdmin = role === "superadmin";
    const isStaff = isSuperAdmin || role === "admin";
    return {
      user,
      ready,
      isAuthed: !!user,
      role,
      isSuperAdmin,
      isAdmin: isStaff,
      canManageUsers: isSuperAdmin,
      login,
      register,
      establishSession,
      logout,
      createUser,
      updateUserRole,
      deleteUser,
      demoAccounts: DEMO_ACCOUNTS,
      /**
       * Websites are private to the account that created them.
       * Admins are NOT peers — admin1 cannot manage admin2's websites.
       * Only the super admin has platform-wide access.
       */
      canManage: (business) => {
        if (!user || !business) return false;
        if (isSuperAdmin) return true;
        return business.owner === user.id || business.ownerEmail === user.email;
      },
    };
  }, [user, ready, login, register, establishSession, logout, createUser, updateUserRole, deleteUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
