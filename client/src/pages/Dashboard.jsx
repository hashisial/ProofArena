import { ClipboardList, FileCheck2, MessageSquare, PackagePlus, Plus, ShieldCheck, Target, Timer } from "lucide-react";
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
import { ROUTES, USER_ROLES } from "../constants/index.js";
import { useAuth } from "../features/auth/useAuth.js";
import { useMyChallenges } from "../features/challenges/useChallenges.js";
import { useMyExecutionPlans } from "../features/executionPlans/useExecutionPlans.js";
import { useMyOutcomeOffers } from "../features/outcomeOffers/useOutcomeOffers.js";

function getQuickActions(currentRole) {
  if (currentRole === USER_ROLES.CLIENT) {
    return [
      {
        description: "Define a measurable goal and prepare providers to submit execution plans.",
        href: ROUTES.NEW_CHALLENGE,
        icon: Plus,
        label: "Create Outcome Challenge",
      },
      {
        description: "Review your draft, open, paused, and archived outcome challenges.",
        href: ROUTES.MY_CHALLENGES,
        icon: Target,
        label: "Manage Challenges",
      },
      {
        description: "Compare providers by proof-backed reputation and delivery focus.",
        href: ROUTES.PROVIDERS,
        icon: ShieldCheck,
        label: "Browse Providers",
      },
      {
        description: "Keep challenge conversations and execution updates in one place.",
        href: ROUTES.MESSAGES,
        icon: MessageSquare,
        label: "Open Messages",
      },
    ];
  }

  return [
    {
      description: "Turn a vague service into a measurable proof-based offer.",
      href: ROUTES.NEW_OUTCOME_OFFER,
      icon: PackagePlus,
      label: "Create Outcome Offer",
    },
    {
      description: "Browse measurable client needs ready for future execution plans.",
      href: ROUTES.CHALLENGES,
      icon: Plus,
      label: "Explore Challenges",
    },
    {
      description: "Track plans submitted to client challenges.",
      href: ROUTES.MY_EXECUTION_PLANS,
      icon: ClipboardList,
      label: "View Execution Plans",
    },
    {
      description: "Inspect submitted evidence before outcomes become reputation.",
      href: ROUTES.PROOF_LEDGER,
      icon: ShieldCheck,
      label: "Review Proof",
    },
    {
      description: "Keep challenge conversations and execution updates in one place.",
      href: ROUTES.MESSAGES,
      icon: MessageSquare,
      label: "Open Messages",
    },
  ];
}

const stats = [
  { detail: "Measurable goals currently being tracked.", label: "Active Challenges", value: "0" },
  { detail: "Evidence packages waiting for review.", label: "Proof Submitted", value: "0" },
  { detail: "Completed work backed by verified proof.", label: "Verified Outcomes", value: "0" },
  { detail: "Admin or client checks still pending.", label: "Pending Reviews", value: "0" },
];

const workflowItems = [
  { icon: Target, label: "Outcome challenges", status: "Ready" },
  { icon: Timer, label: "Milestone tracking", status: "Coming soon" },
  { icon: FileCheck2, label: "Proof review", status: "Coming soon" },
];

function QuickActionCard({ description, href, icon: Icon, label }) {
  return (
    <Card as="a" className="block h-full" href={href} variant="interactive">
      <CardHeader>
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F7FEE7] text-[#3F6212]">
          {createElement(Icon, { "aria-hidden": "true", className: "h-5 w-5" })}
        </div>
        <CardTitle className="text-lg">{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function StatCard({ detail, label, value }) {
  return (
    <Card variant="default">
      <p className="text-sm font-bold text-[#78716C]">{label}</p>
      <p className="mt-3 text-4xl font-black tracking-[-0.06em] text-[#1C1917]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[#78716C]">{detail}</p>
    </Card>
  );
}

export function Dashboard() {
  const { role, user } = useAuth();
  const currentRole = role || user?.role;
  const isClient = currentRole === USER_ROLES.CLIENT;
  const isProvider = currentRole === USER_ROLES.PROVIDER;
  const quickActions = getQuickActions(currentRole);
  const challengesQuery = useMyChallenges({}, { enabled: isClient });
  const plansQuery = useMyExecutionPlans({}, { enabled: isProvider });
  const offersQuery = useMyOutcomeOffers({}, { enabled: isProvider });
  const challenges = challengesQuery.data?.items ?? [];
  const plans = plansQuery.data?.items ?? [];
  const offers = offersQuery.data?.items ?? [];
  const challengeStats = {
    drafts: challenges.filter((challenge) => challenge.status === "draft").length,
    open: challenges.filter((challenge) => challenge.status === "open").length,
    quality: challenges.length > 0
      ? Math.round(challenges.reduce((sum, challenge) => sum + Number(challenge.qualityScore?.score ?? 0), 0) / challenges.length)
      : 0,
    total: challenges.length,
  };
  const offerStats = {
    quality: offers.length > 0
      ? Math.round(offers.reduce((sum, offer) => sum + Number(offer.qualityScore?.score ?? 0), 0) / offers.length)
      : 0,
    published: offers.filter((offer) => offer.status === "published").length,
    total: offers.length,
  };
  const planStats = {
    accepted: plans.filter((plan) => plan.status === "accepted").length,
    shortlisted: plans.filter((plan) => plan.status === "shortlisted").length,
    submitted: plans.filter((plan) => plan.status === "submitted").length,
    total: plans.length,
  };

  return (
    <div className="grid gap-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#3F6212]/16 bg-[radial-gradient(circle_at_92%_12%,rgba(63, 98, 18, 0.14),transparent_32%),linear-gradient(135deg,#ffffff,#fffbeb)] p-6 shadow-[0_24px_80px_rgba(28, 25, 23, 0.08)] md:p-8">
        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-end">
          <div>
            <Badge variant="primary">ProofArena workspace</Badge>
            <h2 className="mt-5 max-w-3xl break-words text-3xl font-black tracking-[-0.055em] text-[#1C1917] sm:text-4xl md:text-6xl md:tracking-[-0.065em]">
              Welcome to ProofArena
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#44403C]">
              Launch measurable outcomes, track execution, and verify proof from one workspace.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button as="a" href={isClient ? ROUTES.NEW_CHALLENGE : ROUTES.CHALLENGES}>
                Create Challenge
              </Button>
              <Button as="a" href={ROUTES.PROOF_LEDGER} variant="outline">
                Explore Proof Ledger
              </Button>
            </div>
          </div>

          <Card className="bg-white/90" variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Challenge pipeline</CardTitle>
              <CardDescription>Foundation for client, provider, and proof workflows.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {workflowItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    className="flex flex-col items-start gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FAFAFA] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    key={item.label}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F7FEE7] text-[#3F6212]">
                        {createElement(Icon, { "aria-hidden": "true", className: "h-4 w-4" })}
                      </span>
                      <span className="min-w-0 break-words text-sm font-black text-[#1C1917]">{item.label}</span>
                    </div>
                    <Badge size="sm" variant={item.status === "Ready" ? "green" : "gray"}>
                      {item.status}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>

      <section aria-labelledby="quick-actions-title">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
              Quick actions
            </p>
            <h2 id="quick-actions-title" className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#1C1917]">
              Start from the core workflow
            </h2>
          </div>
          <Badge variant="outline">No production data yet</Badge>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <QuickActionCard key={action.label} {...action} />
          ))}
        </div>
      </section>

      {isProvider ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Outcome Offers</CardTitle>
              <CardDescription>
                Package services into measurable offers so clients can compare target outcomes, proof, and delivery readiness.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Total offers", offerStats.total],
                  ["Published", offerStats.published],
                  ["Average quality", `${offerStats.quality}/100`],
                ].map(([label, value]) => (
                  <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={label}>
                    <p className="text-sm font-bold text-[#78716C]">{label}</p>
                    <p className="mt-2 text-2xl font-black text-[#1C1917]">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button as="a" href={ROUTES.MY_OUTCOME_OFFERS}>
                Manage Offers
              </Button>
              <Button as="a" href={ROUTES.NEW_OUTCOME_OFFER} variant="outline">
                Create Offer
              </Button>
            </CardFooter>
          </Card>
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Execution Plans</CardTitle>
              <CardDescription>
                Track submitted plans, shortlists, and accepted provider opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Submitted", planStats.submitted],
                  ["Shortlisted", planStats.shortlisted],
                  ["Accepted", planStats.accepted],
                ].map(([label, value]) => (
                  <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={label}>
                    <p className="text-sm font-bold text-[#78716C]">{label}</p>
                    <p className="mt-2 text-2xl font-black text-[#1C1917]">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button as="a" href={ROUTES.MY_EXECUTION_PLANS}>
                View Plans
              </Button>
              <Button as="a" href={ROUTES.CHALLENGES} variant="outline">
                Explore Challenges
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : null}

      {isClient ? (
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Outcome Challenges</CardTitle>
            <CardDescription>
              Turn vague needs into measurable challenges with success criteria, proof requirements, and provider-ready scope.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                ["Total challenges", challengeStats.total],
                ["Open", challengeStats.open],
                ["Drafts", challengeStats.drafts],
                ["Average quality", `${challengeStats.quality}/100`],
              ].map(([label, value]) => (
                <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={label}>
                  <p className="text-sm font-bold text-[#78716C]">{label}</p>
                  <p className="mt-2 text-2xl font-black text-[#1C1917]">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button as="a" href={ROUTES.MY_CHALLENGES}>
              Manage Challenges
            </Button>
            <Button as="a" href={ROUTES.NEW_CHALLENGE} variant="outline">
              Create Challenge
            </Button>
          </CardFooter>
        </Card>
      ) : null}

      <section aria-labelledby="overview-title">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
              Overview
            </p>
            <h2 id="overview-title" className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#1C1917]">
              ProofArena activity
            </h2>
          </div>
          <p className="text-sm font-medium text-[#78716C]">Placeholder values until modules are connected.</p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Outcome challenge workspace</CardTitle>
          <CardDescription>
            Future client and provider dashboards will use this space for active challenges, execution plans, proof review, and messages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            actionHref={isClient ? ROUTES.NEW_CHALLENGE : ROUTES.CHALLENGES}
            actionText="Create Challenge"
            description="Create your first measurable challenge and start tracking verified execution."
            icon={Target}
            title="No outcome challenges yet"
            variant="spotlight"
          />
        </CardContent>
        <CardFooter>
          <Badge variant="primary">Launch outcomes</Badge>
          <Badge variant="gray">Milestone tracking</Badge>
          <Badge variant="green">Verified proof</Badge>
        </CardFooter>
      </Card>
    </div>
  );
}
