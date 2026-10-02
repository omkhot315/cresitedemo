import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import PlatformNav from "../components/common/PlatformNav.jsx";
import BusinessForm from "../components/dashboard/BusinessForm.jsx";
import NotFound from "./NotFound.jsx";
import { useBusinesses } from "../store/BusinessContext.jsx";
import { useAuth } from "../store/AuthContext.jsx";

/** /business/:slug/edit — same builder, pre-filled with the stored site. */
export default function EditBusiness() {
  const { slug } = useParams();
  const { getBySlug, ready } = useBusinesses();
  const { canManage } = useAuth();

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F6F5F1]">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-black/10 border-t-[#5046E5]" />
      </div>
    );
  }

  const business = getBySlug(slug);
  if (!business) return <NotFound slug={slug} />;

  /* Ownership guard — the API enforces this too (403 on write). */
  if (!canManage(business)) {
    return (
      <div className="min-h-screen bg-[#F6F5F1] text-[#101014]">
        <PlatformNav />
        <div className="mx-auto grid min-h-screen max-w-lg place-items-center px-5 pb-20 pt-28 text-center">
          <div>
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-600">
              <ShieldAlert size={24} />
            </span>
            <h1 className="mt-6 font-display text-2xl font-bold">This website isn't yours to edit</h1>
            <p className="mt-3 text-[14.5px] leading-relaxed text-[#55555E]">
              <span className="font-semibold text-[#101014]">{business.name}</span> belongs to another account. Only its
              owner (or a platform admin) can make changes.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#101014] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5046E5]"
              >
                <ArrowLeft size={15} /> My websites
              </Link>
              <a
                href={`/${business.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold transition hover:border-black/30"
              >
                View the live site
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#101014]">
      <PlatformNav />
      <main className="mx-auto max-w-[92rem] px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#77777F] transition hover:text-[#101014]"
        >
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <header className="mb-9 mt-3 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Edit{" "}
              <span className="font-accent-serif italic text-[#5046E5]">{business.name}</span>
            </h1>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#55555E]">
              Live at <span className="rounded-md bg-black/5 px-2 py-0.5 font-mono text-[12.5px] font-semibold">/{business.slug}</span>{" "}
              — every change repaints the preview instantly and ships when you save.
            </p>
          </div>
          <a
            href={business.published ? `/${business.slug}` : `/${business.slug}?preview=1`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-2.5 text-[13px] font-bold transition hover:border-black/30"
          >
            Open current site
          </a>
        </header>

        <BusinessForm mode="edit" initial={business} originalSlug={business.slug} key={business.slug} />
      </main>
    </div>
  );
}
