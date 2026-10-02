import { useParams, useSearchParams, Link } from "react-router-dom";
import { EyeOff, Layers, ArrowLeft } from "lucide-react";
import { useBusinesses } from "../store/BusinessContext.jsx";
import { useAuth } from "../store/AuthContext.jsx";
import BusinessWebsite from "../components/business/BusinessWebsite.jsx";
import SubscriptionExpired from "../components/dashboard/SubscriptionExpired.jsx";
import NotFound from "./NotFound.jsx";

/**
 * The magic route: /:businessSlug
 * 1. Read slug  2. Find business  3. Resolve category template
 * 4. Apply theme  5. Render the complete website
 * Unknown slugs fall through to the professional 404.
 */
export default function BusinessPage() {
  const { businessSlug } = useParams();
  const [params] = useSearchParams();
  const { getBySlug, ready } = useBusinesses();
  const { canManage } = useAuth();

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F6F5F1]">
        <div className="flex flex-col items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#5046E5] to-[#8B5CF6] text-white">
            <Layers size={20} />
          </span>
          <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-black/10 border-t-[#5046E5]" />
        </div>
      </div>
    );
  }

  const business = getBySlug(businessSlug);
  if (!business) return <NotFound slug={businessSlug} />;

  /* Drafts are private: only the creator (or super admin) may preview them. */
  const isPreview = params.get("preview") === "1" && canManage(business);
  if (!business.published && !isPreview) {
    /* An expired subscription gets its own dedicated renew page. */
    if (business.subscriptionStatus === "expired" && !business.paymentExempt) {
      return <SubscriptionExpired business={business} isOwner={canManage(business)} />;
    }
    return <Offline business={business} />;
  }

  return <BusinessWebsite business={business} />;
}

/** Shown when an owner unpublishes a site. */
function Offline({ business }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#F6F5F1] px-5">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-10 text-center shadow-xl">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-600">
          <EyeOff size={24} />
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold text-[#101014]">This website is taking a break</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#77777F]">
          <span className="font-semibold text-[#101014]">{business.name}</span> isn't published yet. If you own this
          site, head to your dashboard and flip it live.
        </p>
        <div className="mt-7 flex flex-col gap-2.5">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#101014] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5046E5]"
          >
            Open dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#55555E] transition hover:bg-black/5"
          >
            <ArrowLeft size={15} /> Back to Cresite
          </Link>
        </div>
      </div>
    </div>
  );
}
