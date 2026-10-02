import { useState } from "react";
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, CheckCircle2, Loader2 } from "lucide-react";
import { useBiz } from "../business/bizContext.js";
import { Reveal, SectionShell, SectionHead, BizButton } from "./primitives.jsx";
import { submitLead } from "../../services/leadApi.js";
import PhoneInput from "../common/PhoneInput.jsx";
import { telLink, waLink, mapsEmbed, withAlpha } from "../../utils/businessUtils.js";

/**
 * Contact — action cards, an enquiry form and a live Google Maps embed.
 *
 * Submitting the form sends the enquiry to the platform's super-admin inbox
 * (so it is never lost), and also offers a WhatsApp hand-off so the business
 * can reply instantly.
 */
export default function BizContact() {
  const { business, skin, preview } = useBiz();
  const c = business.contact || {};
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const rows = [
    c.phone && { icon: Phone, label: "Call us", value: c.phone, href: telLink(c.phone) },
    (c.whatsapp || c.phone) && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: c.whatsapp || c.phone,
      href: waLink(c.whatsapp || c.phone, `Hi ${business.name}!`),
    },
    c.email && { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` },
    c.address && {
      icon: MapPin,
      label: "Visit us",
      value: c.address,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`,
    },
  ].filter(Boolean);

  /**
   * Save the enquiry so it reaches the platform's super-admin dashboard, then
   * offer a WhatsApp hand-off so the business can reply straight away.
   */
  const send = async (e) => {
    e?.preventDefault();
    setError("");
    setNote("");

    if (!form.name.trim()) return setError("Please tell us your name.");
    if (!form.phone.trim() && !form.email.trim()) {
      return setError("Please add a phone number or an email so we can reply.");
    }

    setBusy(true);
    const res = preview
      ? { ok: true, queued: false } /* don't fire requests from the builder preview */
      : await submitLead({ businessSlug: business.slug, ...form });
    setBusy(false);

    if (!res.ok) return setError(res.error || "Something went wrong. Please try again.");

    setSent(true);
    setNote(
      res.queued
        ? "Saved — we'll send your enquiry as soon as we're back online."
        : "Thank you! Your enquiry has been sent."
    );

    /* Optional instant hand-off to WhatsApp if the business has a number. */
    const wa = c.whatsapp || c.phone;
    if (wa) {
      const msg = `Hi ${business.name}! I'm ${form.name.trim()}.${form.phone ? ` My number: ${form.phone}.` : ""} ${
        form.message || "I'd like to make an enquiry."
      }`;
      window.open(waLink(wa, msg), "_blank");
    }

    setForm({ name: "", phone: "", email: "", message: "" });
    setTimeout(() => {
      setSent(false);
      setNote("");
    }, 6000);
  };

  return (
    <SectionShell id="contact">
      <SectionHead id="contact" />

      <div className="grid gap-10 lg:grid-cols-5">
        {/* Action cards */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {rows.map((r, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <a
                href={r.href}
                target={r.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-start gap-4 border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ borderRadius: "calc(var(--r) * 0.75)", background: "var(--card)", borderColor: "var(--line)" }}
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                  style={{ background: withAlpha(skin.theme.primary, 0.11), color: "var(--p)" }}
                >
                  <r.icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10.5px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{r.label}</span>
                  <span className="mt-1 block break-words text-[14px] font-semibold leading-snug">{r.value}</span>
                </span>
              </a>
            </Reveal>
          ))}

          {!!business.hours?.length && (
            <Reveal delay={0.15}>
              <div
                className="border p-4"
                style={{ borderRadius: "calc(var(--r) * 0.75)", background: "var(--card)", borderColor: "var(--line)" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                    style={{ background: withAlpha(skin.theme.primary, 0.11), color: "var(--p)" }}
                  >
                    <Clock size={18} />
                  </span>
                  <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">Opening hours</span>
                </div>
                <div className="mt-3 space-y-1.5 pl-1">
                  {business.hours.map((h, i) => (
                    <p key={i} className="flex flex-wrap justify-between gap-x-4 text-[12.5px]">
                      <span className="font-semibold">{h.day}</span>
                      <span className="text-[var(--muted)]">{h.time}</span>
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* WhatsApp hand-off form */}
        <Reveal delay={0.08} className="lg:col-span-3">
          <form
            onSubmit={send}
            className="border p-6 sm:p-8"
            style={{ borderRadius: "var(--r)", background: "var(--card)", borderColor: "var(--line)" }}
          >
            <h3 style={{ fontFamily: skin.fonts.display, fontWeight: 700, fontSize: "1.35rem" }}>Send us a message</h3>
            <p className="mt-1.5 text-[13px] text-[var(--muted)]">
              Fill this in and we'll get back to you — usually within a few hours.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Your name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Full name"
                  className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--p)]"
                  style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                />
              </label>

              {/* Phone — required in practice: the business needs it to reply. */}
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Phone number <span style={{ color: "var(--p)" }}>·</span>
                  <span className="ml-1 font-semibold normal-case tracking-normal opacity-70">required</span>
                </span>
                <PhoneInput
                  value={form.phone}
                  onChange={(value) => setForm((s) => ({ ...s, phone: value }))}
                  placeholder="98765 43210"
                  className="bg-transparent focus-within:ring-0"
                  style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                Email <span className="font-semibold normal-case tracking-normal opacity-70">(optional)</span>
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--p)]"
                style={{ borderColor: "var(--line)", color: "var(--ink)" }}
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Message</span>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                placeholder="Tell us what you need — appointment, booking, question…"
                className="w-full resize-none rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[var(--p)]"
                style={{ borderColor: "var(--line)", color: "var(--ink)" }}
              />
            </label>

            {error && (
              <p className="mt-4 rounded-xl px-4 py-2.5 text-[12.5px] font-semibold" style={{ background: withAlpha("#EF4444", 0.1), color: "#DC2626" }}>
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <BizButton onClick={send} icon={busy ? Loader2 : sent ? CheckCircle2 : Send}>
                {busy ? "Sending…" : sent ? "Enquiry sent" : "Send enquiry"}
              </BizButton>
              {c.email && (
                <a className="text-[13px] font-semibold text-[var(--muted)] underline-offset-4 transition hover:text-[var(--ink)] hover:underline" href={`mailto:${c.email}`}>
                  or email us instead
                </a>
              )}
            </div>

            {note && (
              <p className="mt-4 flex items-center gap-2 text-[12.5px] font-semibold" style={{ color: "var(--p)" }}>
                <CheckCircle2 size={14} /> {note}
              </p>
            )}
          </form>
        </Reveal>
      </div>

      {c.address && (
        <Reveal className="mt-12">
          <div className="overflow-hidden border" style={{ borderRadius: "var(--r)", borderColor: "var(--line)" }}>
            <iframe
              title={`Map — ${business.name}`}
              src={mapsEmbed(c.address)}
              loading="lazy"
              className="h-72 w-full grayscale-[0.15] sm:h-96"
            />
          </div>
        </Reveal>
      )}
    </SectionShell>
  );
}
