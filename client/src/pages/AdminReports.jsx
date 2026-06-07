import { AlertTriangle, Flag, ShieldAlert } from "lucide-react";
import { AdminPageHeader } from "../components/admin/AdminPageHeader.jsx";
import { AdminStatsCard } from "../components/admin/AdminStatsCard.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { useAdminOverview } from "../features/admin/useAdmin.js";

export function AdminReports() {
  const overviewQuery = useAdminOverview();
  const overview = overviewQuery.data ?? {};

  return (
    <div className="grid gap-6">
      <AdminPageHeader
        description="User reports, flagged content, suspicious proof, spam offers, and unsafe challenges will appear here."
        title="Reports & Flags"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminStatsCard description="Flagged providers, challenges, offers, and proof assets." icon={Flag} label="Flagged Records" value={overview.flaggedItemsCount} />
        <AdminStatsCard description="Records still waiting for a moderation decision." icon={ShieldAlert} label="Pending Moderation" value={overview.pendingModerationCount} />
      </div>
      <EmptyState
        description="Structured user reports and investigation workflows will connect here in a later admin stage. Current flagged records remain available in their moderation pages."
        icon={AlertTriangle}
        title="Report intake foundation"
        variant="bordered"
      />
    </div>
  );
}
