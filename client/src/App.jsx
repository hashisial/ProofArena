import { useLocation } from "react-router-dom";
import { AuthProvider } from "./features/auth/AuthProvider.jsx";
import { ToastProvider } from "./components/ToastProvider.jsx";
import { usePageAnalytics } from "./hooks/usePageAnalytics.js";
import { AppRoutes } from "./routes/AppRoutes.jsx";

function RouteAnalytics() {
  const location = useLocation();
  usePageAnalytics(location.pathname);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouteAnalytics />
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
