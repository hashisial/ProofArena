import { PageLoader } from "../components/ui/PageLoader.jsx";
import { useAuthStore } from "../store/useAuthStore.js";

export function AuthHydration({ children }) {
  const isAuthChecking = useAuthStore((state) => state.isAuthChecking);

  if (isAuthChecking) {
    return (
      <PageLoader
        description="Restoring your secure ProofArena session."
        title="Preparing ProofArena"
      />
    );
  }

  return children;
}
