import { BadgeCheck, ShieldCheck } from "lucide-react";
import { AdminPageHeader } from "../components/admin/AdminPageHeader.jsx";
import { AdminStatsCard } from "../components/admin/AdminStatsCard.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { ROUTES } from "../constants/index.js";
import { useAdminOverview } from "../features/admin/useAdmin.js";

export function AdminVerification() {
  const overviewQuery = useAdminOverview();
  const overview = overviewQuery.data ?? {};

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        description="Provider identity, proof, and profile verification requests will appear here."
        title="Verification Requests"
      />
      <div className="max-w-md">
        <AdminStatsCard description="Pending account, provider, and profile verification records." icon={BadgeCheck} label="Pending Requests" value={overview.verificationPendingCount} />
      </div>
      <EmptyState
        actionHref={ROUTES.ADMIN_PROVIDERS}
        actionText="Review Providers"
        description="Verification request details and document review will connect here in a later admin stage. Provider verification status remains visible in provider review."
        icon={ShieldCheck}
        title="Verification workflow foundation"
        variant="bordered"
      />
    </div>
  );
}
