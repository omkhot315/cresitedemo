import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext.jsx";
import PlatformNav from "./PlatformNav.jsx";

function Splash() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#F6F5F1]">
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-black/10 border-t-[#5046E5]" />
    </div>
  );
}

/** Shown when anyone except the single super admin hits a protected control route. */
function Forbidden() {
  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#101014]">
      <PlatformNav />
      <div className="mx-auto grid min-h-screen max-w-lg place-items-center px-5 pb-20 pt-28 text-center">
        <div>
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-600">
            <ShieldAlert size={24} />
          </span>
          <h1 className="mt-6 font-display text-2xl font-bold">Super admin only</h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-[#55555E]">
            This control room manages accounts and platform-wide settings. Regular admins manage only their own
            websites from the dashboard.
          </p>
          <Link
            to="/dashboard"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#101014] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5046E5]"
          >
            <ArrowLeft size={15} /> Back to my dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Route guard.
 *   <ProtectedRoute>                 — requires any signed-in account
 *   <ProtectedRoute superAdminOnly>  — requires the single super admin
 */
export default function ProtectedRoute({ children, superAdminOnly = false }) {
  const { isAuthed, isSuperAdmin, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <Splash />;
  if (!isAuthed) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  if (superAdminOnly && !isSuperAdmin) return <Forbidden />;
  return children;
}
