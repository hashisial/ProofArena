import { ClipboardList, Scale, ShieldCheck, UsersRound } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { ROUTES } from "../../constants/routes.js";
import {
  getProviderName,
  getSelectedProviderName,
} from "../../features/workspace/workspaceUtils.js";

function SummaryMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
      <p className="text-xs font-black uppercase tracking-[0.13em] text-[#78716C]">{label}</p>
      <p className="mt-2 break-words text-base font-black text-[#1C1917]">{value}</p>
    </div>
  );
}

export function WorkspaceSelectionSummary({
  challenge,
  isError = false,
  isLoading = false,
  plans = [],
  recommendations = [],
  savedProviders = [],
}) {
  const challengeId = challenge?.id || challenge?._id;

  if (isLoading) {
    return (
      <Card as="section" className="h-80 animate-pulse bg-[#FEFCE8]" padding="md" variant="bordered" />
    );
  }

  if (isError) {
    return (
      <Card as="section" padding="md" variant="bordered">
        <EmptyState
          actionHref={challengeId ? ROUTES.CHALLENGE_PROVIDERS(challengeId) : ROUTES.MY_CHALLENGES}
          actionText={challengeId ? "Open Selection Center" : "Manage Challenges"}
          description="The current provider-selection summary could not be loaded. Open the challenge workflow to continue."
          icon={UsersRound}
          size="sm"
          title="Selection summary unavailable"
          variant="minimal"
        />
      </Card>
    );
  }

  if (!challengeId) {
    return (
      <Card as="section" padding="md" variant="bordered">
        <EmptyState
          actionHref={ROUTES.NEW_CHALLENGE}
          actionText="Create Challenge"
          description="Provider selection summaries appear after a client challenge is created."
          icon={UsersRound}
          size="sm"
          title="No active provider selection"
          variant="minimal"
        />
      </Card>
    );
  }

  const bestMatch = [...recommendations]
    .filter((match) => Number.isFinite(Number(match.matchScore)))
    .sort((left, right) => Number(right.matchScore) - Number(left.matchScore))[0];
  const selectedProvider = getSelectedProviderName(challenge, plans, savedProviders);
  const shortlistedCount = savedProviders.filter((item) => item.status === "shortlisted").length;
  const providerStatus = selectedProvider
    ? "Selected"
    : shortlistedCount > 0
      ? "Shortlisting"
      : recommendations.length > 0
        ? "Reviewing recommendations"
        : "No candidates yet";

  return (
    <Card as="section" padding="md" variant="bordered">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary">Provider selection summary</Badge>
          <Badge variant={selectedProvider ? "green" : "gray"}>{providerStatus}</Badge>
        </div>
        <CardTitle>{challenge.title || "Active challenge"}</CardTitle>
        <CardDescription>Decision support for the current active challenge using existing match, shortlist, and plan data.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          <SummaryMetric label="Best match provider" value={bestMatch ? `${getProviderName(bestMatch.provider)} · ${Math.round(Number(bestMatch.matchScore))}%` : "Not available"} />
          <SummaryMetric label="Shortlisted count" value={shortlistedCount} />
          <SummaryMetric label="Selected provider" value={selectedProvider || "Not selected"} />
          <SummaryMetric label="Provider status" value={providerStatus} />
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <Button as="a" href={ROUTES.CHALLENGE_PROVIDERS(challengeId)}>
            <UsersRound aria-hidden="true" className="mr-2 h-4 w-4" />
            View Providers
          </Button>
          <Button as="a" href={ROUTES.PROVIDER_SELECTION(challengeId)} variant="secondary">
            <Scale aria-hidden="true" className="mr-2 h-4 w-4" />
            Compare Providers
          </Button>
          <Button as="a" href={ROUTES.CHALLENGE_PLANS(challengeId)} variant="outline">
            <ClipboardList aria-hidden="true" className="mr-2 h-4 w-4" />
            Review Plans
          </Button>
        </div>
        <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-[#78716C]">
          <ShieldCheck aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#3F6212]" />
          This summary reports visible operational state only. It does not infer a winner or start contracts, payments, or milestones.
        </p>
      </CardContent>
    </Card>
  );
}
