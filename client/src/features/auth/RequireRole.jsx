import { Button } from "../../components/Button.jsx";
import { LoadingState } from "../../components/LoadingState.jsx";
import { ROUTES } from "../../constants/index.js";
import { useAuth } from "../../hooks/useAuth.js";
import { Forbidden } from "../../pages/Forbidden.jsx";
import { hasPermission, hasRole, WORKSPACE_ROLES } from "./roleAccess.js";

export function RequireRole({
  allowedRoles = WORKSPACE_ROLES,
  children,
  permission,
}) {
  const { isAuthenticated, isBootstrapping, user } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen bg-white p-8">
        <LoadingState columns={3} />
      </div>
    );
  }

  const hasAllowedRole = hasRole(user, allowedRoles);
  const hasRequiredPermission = permission ? hasPermission(user, permission) : true;

  if (!isAuthenticated) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(124, 58, 237, 0.16),transparent_32%),linear-gradient(180deg,#ffffff,#f6f2ff)] px-5">
        <div className="max-w-lg rounded-[2rem] border border-black/10 bg-white p-8 text-center shadow-[0_30px_90px_rgba(17,17,17,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7C3AED]">
            Protected Workspace
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.06em] text-black">
            Access required
          </h1>
          <p className="mt-4 text-sm leading-6 text-black/58">
            Sign in with a workspace account that has the right role for this page.
          </p>
          <Button as="a" className="mt-6" href={ROUTES.LOGIN}>
            Login or Register
          </Button>
        </div>
      </section>
    );
  }

  if (!hasAllowedRole || !hasRequiredPermission) {
    return <Forbidden />;
  }

  return children;
}
