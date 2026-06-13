import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RotateCcw, Search, UsersRound } from "lucide-react";
import { ChallengeCard } from "../components/challenges/ChallengeCard.jsx";
import { ChallengeEmptyState } from "../components/challenges/ChallengeEmptyState.jsx";
import { ChallengeManagementTabs } from "../components/challenges/ChallengeManagementTabs.jsx";
import { challengeManagementTabs } from "../components/challenges/challengeManagementTabs.js";
import { ChallengeStatsStrip } from "../components/challenges/ChallengeStatsStrip.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Select } from "../components/ui/Select.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import {
  useArchiveChallenge,
  useCloseChallenge,
  useMyChallenges,
  usePauseChallenge,
  usePublishChallenge,
} from "../features/challenges/useChallenges.js";
import { getChallengeApiErrorMessage } from "../features/challenges/challengeUtils.js";
import { getPlansCount } from "../utils/challengeNextAction.js";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Open", value: "open" },
  { label: "Reviewing plans", value: "reviewing_plans" },
  { label: "Provider selected", value: "provider_selected" },
  { label: "In progress", value: "in_progress" },
  { label: "Proof review", value: "proof_review" },
  { label: "Completed", value: "completed" },
  { label: "Paused", value: "paused" },
  { label: "Archived", value: "archived" },
  { label: "Cancelled", value: "cancelled" },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Last updated", value: "last_updated" },
  { label: "Most plans", value: "most_plans" },
  { label: "Highest quality score", value: "quality_score" },
  { label: "Urgency", value: "urgency" },
];

const urgencyRank = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
};

function getChallengeId(challenge) {
  return challenge?.id ?? challenge?._id;
}

function getDateTime(value) {
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime()) ? date.getTime() : 0;
}

function getEmptyCopy(activeTab) {
  const tab = challengeManagementTabs.find((item) => item.value === activeTab);

  if (activeTab === "draft") {
    return {
      description: "Draft challenges will appear here until they are ready to publish.",
      title: "No draft challenges",
    };
  }

  if (activeTab === "open") {
    return {
      description: "Published challenges that are ready for provider plans will appear here.",
      title: "No open challenges",
    };
  }

  if (activeTab === "reviewing_plans") {
    return {
      description: "Challenges with plan review activity will appear here.",
      title: "No challenges reviewing plans",
    };
  }

  return {
    description: `${tab?.label ?? "Matching"} challenges will appear here when that workflow state exists.`,
    title: `No ${String(tab?.label ?? "matching").toLowerCase()} challenges`,
  };
}

export function MyChallenges() {
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    category: "",
    q: "",
    sort: "last_updated",
    status: "all",
  });
  const challengesQuery = useMyChallenges({});
  const publishMutation = usePublishChallenge();
  const pauseMutation = usePauseChallenge();
  const closeMutation = useCloseChallenge();
  const archiveMutation = useArchiveChallenge();
  const challenges = useMemo(() => challengesQuery.data?.items ?? [], [challengesQuery.data?.items]);
  const categoryOptions = useMemo(() => {
    const categories = Array.from(
      new Set(challenges.map((challenge) => String(challenge.category ?? "").trim()).filter(Boolean)),
    ).sort((left, right) => left.localeCompare(right));

    return [
      { label: "All categories", value: "" },
      ...categories.map((category) => ({ label: category, value: category })),
    ];
  }, [challenges]);
  const filteredChallenges = useMemo(() => {
    const search = filters.q.trim().toLowerCase();
    const category = filters.category.trim().toLowerCase();
    const selectedTab = challengeManagementTabs.find((tab) => tab.value === activeTab);
    const tabStatuses = selectedTab?.statuses ?? [];

    const result = challenges.filter((challenge) => {
      const matchesTab = tabStatuses.length === 0 || tabStatuses.includes(challenge.status);
      const matchesStatus = filters.status === "all" || challenge.status === filters.status;
      const matchesSearch = !search ||
        [
          challenge.title,
          challenge.shortSummary,
          challenge.category,
          challenge.subCategory,
          challenge.targetOutcome?.outcomeStatement,
          ...(challenge.skillsNeeded ?? []),
          ...(challenge.toolsNeeded ?? []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);
      const matchesCategory = !category || String(challenge.category ?? "").toLowerCase() === category;

      return matchesTab && matchesStatus && matchesSearch && matchesCategory;
    });

    return [...result].sort((left, right) => {
      if (filters.sort === "quality_score") {
        return Number(right.qualityScore?.score ?? 0) - Number(left.qualityScore?.score ?? 0);
      }

      if (filters.sort === "most_plans") {
        return getPlansCount(right) - getPlansCount(left);
      }

      if (filters.sort === "urgency") {
        return (urgencyRank[right.urgency] ?? 0) - (urgencyRank[left.urgency] ?? 0);
      }

      if (filters.sort === "newest") {
        return getDateTime(right.createdAt) - getDateTime(left.createdAt);
      }

      return getDateTime(right.updatedAt ?? right.createdAt) - getDateTime(left.updatedAt ?? left.createdAt);
    });
  }, [activeTab, challenges, filters]);
  const actionState = {
    isArchiving: archiveMutation.isPending,
    isClosing: closeMutation.isPending,
    isPausing: pauseMutation.isPending,
    isPublishing: publishMutation.isPending,
  };
  const tabEmptyCopy = getEmptyCopy(activeTab);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function resetFilters() {
    setActiveTab("all");
    setFilters({ category: "", q: "", sort: "last_updated", status: "all" });
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[2rem] border border-[#3F6212]/16 bg-[linear-gradient(135deg,#ffffff,#fefce8)] p-6 shadow-[0_24px_80px_rgba(28,25,23,0.08)] md:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Badge variant="primary">Client challenge control</Badge>
            <h1 className="mt-4 text-4xl font-black tracking-normal text-[#1C1917] md:text-5xl">
              My Challenges
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#57534E]">
              Manage draft, open, reviewing, and active outcome challenges from one control center.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Button as={Link} className="w-full sm:w-auto" to={ROUTES.NEW_CHALLENGE}>
              <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
              Create Challenge
            </Button>
            <Button as={Link} className="w-full sm:w-auto" to={ROUTES.PROVIDERS} variant="outline">
              <UsersRound aria-hidden="true" className="mr-2 h-4 w-4" />
              Find Providers
            </Button>
          </div>
        </div>
      </section>

      <ChallengeStatsStrip challenges={challenges} />

      <ChallengeManagementTabs activeTab={activeTab} challenges={challenges} onChange={setActiveTab} />

      <Card padding="md" variant="default">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_repeat(3,minmax(0,1fr))_auto] lg:items-end">
          <Input
            label="Search challenges"
            leftIcon={<Search className="h-4 w-4" />}
            onChange={(event) => updateFilter("q", event.target.value)}
            placeholder="Search by outcome, skill, proof, or title"
            type="search"
            value={filters.q}
          />
          <Select
            label="Category"
            onChange={(event) => updateFilter("category", event.target.value)}
            options={categoryOptions}
            placeholder=""
            value={filters.category}
          />
          <Select
            label="Status"
            onChange={(event) => updateFilter("status", event.target.value)}
            options={statusOptions}
            placeholder=""
            value={filters.status}
          />
          <Select
            label="Sort"
            onChange={(event) => updateFilter("sort", event.target.value)}
            options={sortOptions}
            placeholder=""
            value={filters.sort}
          />
          <Button className="lg:min-h-12" onClick={resetFilters} type="button" variant="secondary">
            <RotateCcw aria-hidden="true" className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </Card>

      {challengesQuery.isError ? (
        <Card padding="lg" variant="bordered">
          <Badge variant="red">Could not load challenges</Badge>
          <h2 className="mt-3 text-2xl font-black text-[#1C1917]">Challenges unavailable</h2>
          <p className="mt-2 text-sm leading-6 text-[#78716C]">
            {getChallengeApiErrorMessage(challengesQuery.error, "Challenge list could not be loaded. Please try again.")}
          </p>
          <Button className="mt-5" onClick={() => challengesQuery.refetch()} type="button">
            Retry
          </Button>
        </Card>
      ) : null}

      {challengesQuery.isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton className="h-96" key={index} />
          ))}
        </div>
      ) : null}

      {!challengesQuery.isLoading && !challengesQuery.isError && challenges.length === 0 ? (
        <ChallengeEmptyState />
      ) : null}

      {!challengesQuery.isLoading && !challengesQuery.isError && challenges.length > 0 && filteredChallenges.length === 0 ? (
        <EmptyState
          actionText="Clear filters"
          description={tabEmptyCopy.description}
          icon={Search}
          onAction={resetFilters}
          secondaryActionHref={ROUTES.NEW_CHALLENGE}
          secondaryActionText="Create Challenge"
          title={tabEmptyCopy.title}
          variant="bordered"
        />
      ) : null}

      {filteredChallenges.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              actionState={actionState}
              challenge={challenge}
              key={getChallengeId(challenge)}
              onArchive={(challengeId) => archiveMutation.mutateAsync(challengeId)}
              onClose={(challengeId) => closeMutation.mutateAsync(challengeId)}
              onPause={(challengeId) => pauseMutation.mutateAsync(challengeId)}
              onPublish={(challengeId) => publishMutation.mutateAsync(challengeId)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
