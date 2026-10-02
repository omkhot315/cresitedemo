import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext.jsx";
import { BusinessProvider } from "./store/BusinessContext.jsx";
import { ErrorBoundary } from "./components/common/ErrorBoundary.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BusinessProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </BusinessProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
