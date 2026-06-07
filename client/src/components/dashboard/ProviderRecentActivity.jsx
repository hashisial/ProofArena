import { Activity, ClipboardList, FileCheck2, PackagePlus, Target, Trophy } from "lucide-react";
import { createElement } from "react";
import { ROUTES } from "../../constants/index.js";
import { formatDate } from "../../utils/formatDate.js";
import { Badge } from "../ui/Badge.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

function getId(item) {
  return item?.id || item?._id;
}

function getTimestamp(item) {
  return item?.updatedAt || item?.createdAt;
}

function isCreatedEvent(item) {
  if (!item?.createdAt || !item?.updatedAt) {
    return Boolean(item?.createdAt);
  }

  return new Date(item.updatedAt).getTime() - new Date(item.createdAt).getTime() < 1000;
}

function getPlanActivityLabel(status) {
  if (status === "shortlisted") return "Plan shortlisted";
  if (status === "accepted") return "Plan accepted";
  if (status === "rejected") return "Plan rejected";
  if (status === "withdrawn") return "Plan withdrawn";
  if (status === "draft") return "Plan updated";
  return "Plan submitted";
}

function buildActivity({ matches = [], offers = [], opportunities = [], plans = [], proofAssets = [] }) {
  const activity = [];

  offers.forEach((offer) => {
    const id = getId(offer);
    activity.push({
      date: getTimestamp(offer),
      href: id ? ROUTES.OWNER_OUTCOME_OFFER(id) : ROUTES.MY_OUTCOME_OFFERS,
      icon: PackagePlus,
      label: offer.status === "published" ? "Offer published" : isCreatedEvent(offer) ? "Offer created" : "Offer updated",
      title: offer.title || "Outcome offer",
    });
  });

  matches.forEach((match) => {
    activity.push({
      date: getTimestamp(match),
      href: ROUTES.MATCHED_CHALLENGES,
      icon: Target,
      label: match.status === "saved" ? "Match saved" : "Challenge matched",
      title: match.challenge?.title || "Matched challenge",
    });
  });

  plans.forEach((plan) => {
    const id = getId(plan);
    activity.push({
      date: plan.submittedAt || getTimestamp(plan),
      href: id ? ROUTES.EXECUTION_PLAN_DETAIL(id) : ROUTES.MY_EXECUTION_PLANS,
      icon: plan.status === "accepted" ? Trophy : ClipboardList,
      label: getPlanActivityLabel(plan.status),
      title: plan.title || "Execution plan",
    });
  });

  proofAssets.forEach((asset) => {
    const id = getId(asset);
    activity.push({
      date: getTimestamp(asset),
      href: id ? ROUTES.PROOF_ASSET_DETAIL(id) : ROUTES.PROOF_VAULT,
      icon: FileCheck2,
      label: asset.verificationStatus === "verified" ? "Proof verified" : isCreatedEvent(asset) ? "Proof asset added" : "Proof asset updated",
      title: asset.title || asset.name || "Proof asset",
    });
  });

  opportunities.forEach((opportunity) => {
    const id = getId(opportunity);
    activity.push({
      date: getTimestamp(opportunity),
      href: id ? ROUTES.OPPORTUNITY_DETAIL(id) : ROUTES.OPPORTUNITY_PIPELINE,
      icon: opportunity.stage === "won" ? Trophy : ClipboardList,
      label: opportunity.stage === "won" ? "Opportunity won" : "Opportunity updated",
      title: opportunity.title || "Provider opportunity",
    });
  });

  return activity
    .filter((item) => item.date)
    .sort((left, right) => new Date(right.date) - new Date(left.date))
    .slice(0, 7);
}

export function ProviderRecentActivity({ isLoading = false, ...props }) {
  const activity = buildActivity(props);

  return (
    <Card as="section" className="h-full" padding="lg" variant="bordered">
      <CardHeader>
        <CardTitle as="h2">Recent Activity</CardTitle>
        <CardDescription>Real activity from offers, matches, plans, proof assets, and opportunities.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3">
            {[0, 1, 2, 3].map((item) => <Skeleton className="h-20" key={item} />)}
          </div>
        ) : activity.length > 0 ? (
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
            description="Provider activity will appear here."
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
