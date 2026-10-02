import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import PaymentStatus from "../pages/PaymentStatus.jsx";
import CreateWebsite from "../pages/CreateWebsite.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import EditBusiness from "../pages/EditBusiness.jsx";
import AdminPanel from "../pages/AdminPanel.jsx";
import BusinessPage from "../pages/BusinessPage.jsx";
import NotFound from "../pages/NotFound.jsx";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";

/**
 * Central routing table.
 *
 *   public  : /            landing
 *             /login       sign in
 *             /signup      public sign-up (creates an "owner")
 *             /:slug       the generated business websites
 *   authed  : /create, /dashboard, /business/:slug/edit
 *   superadmin: /admin
 *
 * Any other single-segment path is treated as a business slug and rendered by
 * the data-driven website engine; unknown slugs fall through to a 404.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function AppRoutes() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login initialMode="register" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/payment/status"
          element={
            <ProtectedRoute>
              <PaymentStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateWebsite />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/:slug/edit"
          element={
            <ProtectedRoute>
              <EditBusiness />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute superAdminOnly>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route path="/:businessSlug" element={<BusinessPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
