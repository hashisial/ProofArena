import {
  AlertTriangle,
  BarChart3,
  FileCheck2,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { createElement } from "react";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";

const adminStats = [
  {
    detail: "Accounts across clients, providers, and platform admins.",
    label: "Total Users",
    value: "0",
  },
  {
    detail: "Provider applications waiting for verification.",
    label: "Pending Providers",
    value: "0",
  },
  {
    detail: "Outcome challenges currently visible or under review.",
    label: "Open Challenges",
    value: "0",
  },
  {
    detail: "Submitted evidence packages waiting for a decision.",
    label: "Proof Under Review",
    value: "0",
  },
];

const adminActions = [
  {
    description: "Prepare verification workflows for provider applications and trust signals.",
    href: "/admin/providers",
    icon: ShieldCheck,
    label: "Review Providers",
  },
  {
    description: "Inspect submitted proof before outcomes become reputation.",
    href: "/admin/proof-review",
    icon: FileCheck2,
    label: "Review Proof",
  },
  {
    description: "Moderate challenge quality, scope, visibility, and platform fit.",
    href: "/admin/challenges",
    icon: Target,
    label: "Moderate Challenges",
  },
  {
    description: "Track trust, safety, proof approval, and dispute signals.",
    href: "/admin/reports",
    icon: BarChart3,
    label: "View Reports",
  },
];

const trustItems = [
  "Provider verification queues",
  "Proof approval and rejection flows",
  "Dispute moderation workspace",
  "Challenge quality review",
];

function AdminStatCard({ detail, label, value }) {
  return (
    <Card variant="default">
      <p className="text-sm font-bold text-[#78716C]">{label}</p>
      <p className="mt-3 text-4xl font-black tracking-[-0.06em] text-[#1C1917]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#78716C]">{detail}</p>
    </Card>
  );
}

function AdminActionCard({ description, href, icon, label }) {
  return (
    <Card as="a" className="block h-full" href={href} variant="interactive">
      <CardHeader>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F7FEE7] text-[#3F6212]">
          {createElement(icon, { "aria-hidden": "true", className: "h-5 w-5" })}
        </div>
        <CardTitle className="text-lg">{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export function Admin() {
  return (
    <div className="grid gap-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#3F6212]/16 bg-[radial-gradient(circle_at_92%_12%,rgba(63, 98, 18, 0.14),transparent_32%),linear-gradient(135deg,#ffffff,#fefce8)] p-6 shadow-[0_24px_80px_rgba(28, 25, 23, 0.08)] md:p-8">
        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-end">
          <div>
            <Badge variant="black">Platform admin</Badge>
            <h2 className="mt-5 max-w-4xl break-words text-3xl font-black tracking-[-0.055em] text-[#1C1917] sm:text-4xl md:text-6xl md:tracking-[-0.065em]">
              ProofArena Control Center
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[#44403C]">
              Manage outcome challenges, provider quality, proof verification, and platform trust from one workspace.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button as="a" href="/admin/providers">
                Review Providers
              </Button>
              <Button as="a" href="/admin/proof-review" variant="outline">
                Review Proof
              </Button>
            </div>
          </div>

          <Card className="bg-white/90" variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Admin readiness</CardTitle>
              <CardDescription>Foundation for trust, safety, proof, and moderation workflows.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {trustItems.map((item) => (
                <div
                  className="flex flex-col items-start gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FAFAFA] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  key={item}
                >
                  <span className="min-w-0 break-words text-sm font-black text-[#1C1917]">{item}</span>
                  <Badge size="sm" variant="gray">
                    Coming soon
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section aria-labelledby="admin-stats-title">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
              Platform overview
            </p>
            <h2 id="admin-stats-title" className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#1C1917]">
              Trust and operations snapshot
            </h2>
          </div>
          <Badge variant="outline">Placeholder values</Badge>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminStats.map((stat) => (
            <AdminStatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section aria-labelledby="admin-actions-title">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
            Admin actions
          </p>
          <h2 id="admin-actions-title" className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#1C1917]">
            Prepare the moderation workflow
          </h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {adminActions.map((action) => (
            <AdminActionCard key={action.label} {...action} />
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Trust & Safety</CardTitle>
            <CardDescription>
              Provider verification, proof review, and dispute moderation will appear here as the platform grows.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              actionHref="/admin/proof-review"
              actionText="Open Proof Review"
              description="Provider verification, proof review, and dispute moderation will appear here as the platform grows."
              icon={AlertTriangle}
              title="Trust system coming online"
              variant="spotlight"
            />
          </CardContent>
          <CardFooter>
            <Badge variant="primary">Verified proof</Badge>
            <Badge variant="yellow">Pending review</Badge>
            <Badge variant="gray">Moderation ready</Badge>
          </CardFooter>
        </Card>

        <Card variant="muted">
          <CardHeader>
            <CardTitle>Future admin modules</CardTitle>
            <CardDescription>
              This shell is ready for user management, provider verification, challenge review, proof decisions, disputes, and reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              ["Users", "Role changes, account status, suspensions"],
              ["Providers", "Verification, featuring, proof score review"],
              ["Challenges", "Approval, rejection, pause decisions"],
              ["Reports", "Proof approval rate, dispute rate, platform signals"],
            ].map(([title, description]) => (
              <div className="rounded-2xl border border-[#E7E5E4] bg-white px-4 py-3" key={title}>
                <div className="flex items-center gap-3">
                  <Users aria-hidden="true" className="h-4 w-4 text-[#3F6212]" />
                  <p className="text-sm font-black text-[#1C1917]">{title}</p>
                </div>
                <p className="mt-1 text-sm leading-6 text-[#78716C]">{description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
