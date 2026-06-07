import { Activity, Bookmark, ClipboardList, Target, UsersRound } from "lucide-react";
import { createElement } from "react";
import { Badge } from "../ui/Badge.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { ROUTES } from "../../constants/index.js";
import { formatDate } from "../../utils/formatDate.js";

function getChallengeId(challenge) {
  return challenge?.id || challenge?._id;
}

function getPlanId(plan) {
  return plan?.id || plan?._id;
}

function getDateValue(value) {
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime()) ? date.getTime() : 0;
}

function buildActivity({ activeChallenge, challenges = [], plans = [], recommendations = [], savedProviders = [] }) {
  const items = [];

  challenges.forEach((challenge) => {
    const challengeId = getChallengeId(challenge);

    if (challenge.createdAt) {
      items.push({
        date: challenge.createdAt,
        href: challengeId ? ROUTES.OWNER_CHALLENGE(challengeId) : ROUTES.MY_CHALLENGES,
        icon: Target,
        label: "Challenge created",
        title: challenge.title || "Outcome challenge",
      });
    }

    if (challenge.publishedAt) {
      items.push({
        date: challenge.publishedAt,
        href: challengeId ? ROUTES.OWNER_CHALLENGE(challengeId) : ROUTES.MY_CHALLENGES,
        icon: Target,
        label: "Challenge published",
        title: challenge.title || "Outcome challenge",
      });
    }
  });

  plans.forEach((plan) => {
    const planId = getPlanId(plan);
    const challengeId = getChallengeId(activeChallenge || plan.challenge);

    items.push({
      date: plan.submittedAt || plan.createdAt,
      href: challengeId && planId ? ROUTES.CLIENT_EXECUTION_PLAN(challengeId, planId) : ROUTES.MY_CHALLENGES,
      icon: ClipboardList,
      label: plan.status === "shortlisted" ? "Plan shortlisted" : "Execution plan received",
      title: plan.title || "Execution plan",
    });
  });

  recommendations
    .filter((match) => ["saved", "invited"].includes(match.status))
    .forEach((match) => {
      const challengeId = getChallengeId(activeChallenge || match.challenge);
      items.push({
        date: match.updatedAt || match.createdAt,
        href: challengeId ? ROUTES.RECOMMENDED_PROVIDERS(challengeId) : ROUTES.MY_CHALLENGES,
        icon: UsersRound,
        label: match.status === "invited" ? "Provider invited" : "Provider saved",
        title: match.provider?.displayName || match.provider?.username || "Recommended provider",
      });
    });

  savedProviders.forEach((savedProvider) => {
    items.push({
      date: savedProvider.createdAt,
      href: ROUTES.SAVED_PROVIDERS,
      icon: Bookmark,
      label: savedProvider.status === "shortlisted" ? "Provider shortlisted" : "Provider saved",
      title:
        savedProvider.provider?.displayName ||
        savedProvider.provider?.fullName ||
        savedProvider.provider?.username ||
        "Saved provider",
    });
  });

  return items
    .filter((item) => item.date)
    .sort((left, right) => getDateValue(right.date) - getDateValue(left.date))
    .slice(0, 6);
}

export function ClientRecentActivity({ activeChallenge, challenges, plans, recommendations, savedProviders }) {
  const activity = buildActivity({ activeChallenge, challenges, plans, recommendations, savedProviders });

  return (
    <Card as="section" padding="md" variant="bordered">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Safe timeline from challenges, plans, recommendations, and saved providers.</CardDescription>
      </CardHeader>
      <CardContent>
        {activity.length > 0 ? (
          <ol className="grid gap-3">
            {activity.map((item) => (
              <li className="rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4" key={`${item.label}-${item.title}-${item.date}`}>
                <a className="flex min-w-0 items-start gap-3 focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70" href={item.href}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#7C3AED]">
                    {createElement(item.icon || Activity, { "aria-hidden": "true", className: "h-5 w-5" })}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="break-words text-sm font-black text-[#07030D]">{item.title}</span>
                      <Badge size="sm" variant="gray">{item.label}</Badge>
                    </span>
                    <span className="mt-1 block text-xs font-bold text-[#6F657C]">
                      {formatDate(item.date, { fallback: "Recently" })}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState
            description="Challenge creation, plan submissions, recommendations, and saved providers will appear here when they happen."
            icon={Activity}
            size="sm"
            title="No recent activity yet"
            variant="minimal"
          />
        )}
      </CardContent>
    </Card>
  );
}
