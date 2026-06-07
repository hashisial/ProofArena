import {
  AlertTriangle,
  FileCheck2,
  Flag,
  PackageCheck,
  ShieldCheck,
  Target,
  UserCheck,
  Users,
} from "lucide-react";
import { AdminModerationQueue } from "../components/admin/AdminModerationQueue.jsx";
import { AdminPageHeader } from "../components/admin/AdminPageHeader.jsx";
import { AdminRecentList } from "../components/admin/AdminRecentList.jsx";
import { AdminStatsCard } from "../components/admin/AdminStatsCard.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import { useAdminOverview } from "../features/admin/useAdmin.js";
import { formatNumber } from "../utils/formatNumber.js";

const statDefinitions = [
  { key: "totalUsers", label: "Users", description: "All client, provider, and admin accounts.", icon: Users },
  { key: "totalProviders", label: "Providers", description: "Provider accounts across the platform.", icon: ShieldCheck },
  { key: "totalClients", label: "Clients", description: "Client accounts managing outcome work.", icon: UserCheck },
  { key: "totalChallenges", label: "Challenges", description: "All outcome challenges created.", icon: Target },
  { key: "totalOutcomeOffers", label: "Outcome Offers", description: "All provider outcome offers.", icon: PackageCheck },
  { key: "totalProofAssets", label: "Proof Assets", description: "Private and public proof assets stored.", icon: FileCheck2 },
  { key: "pendingModerationCount", label: "Pending Moderation", description: "Records waiting for an admin decision.", icon: AlertTriangle },
  { key: "verificationPendingCount", label: "Verification Requests", description: "Pending account, provider, and profile verification.", icon: Flag },
];

export function AdminDashboard() {
  const overviewQuery = useAdminOverview();
  const overview = overviewQuery.data ?? {};

  return (
    <div className="grid gap-8">
      <AdminPageHeader
        description="Monitor platform users, providers, challenges, offers, proof assets, reports, and moderation queues."
        eyebrow="Platform trust control center"
        title="Admin Dashboard"
      />

      {overviewQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton className="h-40" key={index} />
          ))}
        </div>
      ) : null}

      {overviewQuery.isError ? (
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Could not load admin overview</CardTitle>
            <CardDescription>The platform overview request failed. Retry to reconnect to the admin API.</CardDescription>
          </CardHeader>
          <Button className="mt-5" onClick={() => overviewQuery.refetch()} type="button" variant="secondary">
            Retry
          </Button>
        </Card>
      ) : null}

      {!overviewQuery.isLoading && !overviewQuery.isError ? (
        <>
          <section aria-labelledby="admin-platform-stats">
            <h3 className="sr-only" id="admin-platform-stats">Platform statistics</h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statDefinitions.map((stat) => (
                <AdminStatsCard key={stat.key} {...stat} value={overview[stat.key]} />
              ))}
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
            <AdminModerationQueue items={overview.moderationQueue} />
            <Card variant="muted">
              <CardHeader>
                <CardTitle>Platform health foundation</CardTitle>
                <CardDescription>Current trust workload from real moderation and verification records.</CardDescription>
              </CardHeader>
              <dl className="mt-5 grid gap-4">
                {[
                  ["Open challenges", overview.openChallenges],
                  ["Published offers", overview.publishedOutcomeOffers],
                  ["Flagged records", overview.flaggedItemsCount],
                  ["Pending verification", overview.verificationPendingCount],
                ].map(([label, value]) => (
                  <div className="flex items-center justify-between gap-4 border-b border-[#E9E2F3] pb-3 last:border-0 last:pb-0" key={label}>
                    <dt className="text-sm font-bold text-[#6F657C]">{label}</dt>
                    <dd className="text-lg font-black text-[#07030D]">{formatNumber(value, { fallback: "Not available" })}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <Button as="a" href={ROUTES.ADMIN_REPORTS} variant="secondary">Open Reports & Flags</Button>
                <Button as="a" href={ROUTES.ADMIN_VERIFICATION} variant="outline">Open Verification</Button>
              </div>
            </Card>
          </div>

          <section aria-labelledby="admin-recent-records">
            <h3 className="text-2xl font-black tracking-normal text-[#07030D]" id="admin-recent-records">Recent platform records</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <AdminRecentList description="Newest platform accounts." items={overview.recentUsers} title="Recent Users" />
              <AdminRecentList description="Newest client challenges." items={overview.recentChallenges} title="Recent Challenges" />
              <AdminRecentList description="Newest provider outcome offers." items={overview.recentOffers} title="Recent Outcome Offers" />
              <AdminRecentList description="Newest provider proof assets." items={overview.recentProofAssets} title="Recent Proof Assets" />
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
