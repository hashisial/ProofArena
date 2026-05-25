import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RotateCcw } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { ChallengeCard } from "../components/challenges/ChallengeCard.jsx";
import { ChallengeEmptyState } from "../components/challenges/ChallengeEmptyState.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
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

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Open", value: "open" },
  { label: "Reviewing plans", value: "reviewing_plans" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Paused", value: "paused" },
  { label: "Archived", value: "archived" },
];

const visibilityOptions = [
  { label: "All visibility", value: "all" },
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
  { label: "Invite only", value: "invite_only" },
  { label: "Unlisted", value: "unlisted" },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Quality score", value: "quality_score" },
  { label: "Plans", value: "plans" },
];

function StatCard({ label, value }) {
  return (
    <Card padding="sm" variant="muted">
      <p className="text-sm font-bold text-[#78716C]">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#1C1917]">{value}</p>
    </Card>
  );
}

function getChallengeId(challenge) {
  return challenge?.id ?? challenge?._id;
}

export function MyChallenges() {
  const [filters, setFilters] = useState({
    category: "",
    q: "",
    sort: "newest",
    status: "all",
    visibility: "all",
  });
  const queryFilters = {
    status: filters.status === "all" ? "" : filters.status,
    visibility: filters.visibility === "all" ? "" : filters.visibility,
  };
  const challengesQuery = useMyChallenges(queryFilters);
  const publishMutation = usePublishChallenge();
  const pauseMutation = usePauseChallenge();
  const closeMutation = useCloseChallenge();
  const archiveMutation = useArchiveChallenge();
  const challenges = useMemo(() => challengesQuery.data?.items ?? [], [challengesQuery.data?.items]);
  const filteredChallenges = useMemo(() => {
    const search = filters.q.trim().toLowerCase();
    const category = filters.category.trim().toLowerCase();
    const result = challenges.filter((challenge) => {
      const matchesSearch = !search ||
        [challenge.title, challenge.shortSummary, challenge.targetOutcome?.outcomeStatement]
          .join(" ")
          .toLowerCase()
          .includes(search);
      const matchesCategory = !category || String(challenge.category ?? "").toLowerCase().includes(category);

      return matchesSearch && matchesCategory;
    });

    return [...result].sort((left, right) => {
      if (filters.sort === "quality_score") {
        return Number(right.qualityScore?.score ?? 0) - Number(left.qualityScore?.score ?? 0);
      }

      if (filters.sort === "plans") {
        return Number(right.applicationStats?.totalPlans ?? 0) - Number(left.applicationStats?.totalPlans ?? 0);
      }

      return new Date(right.updatedAt ?? right.createdAt ?? 0) - new Date(left.updatedAt ?? left.createdAt ?? 0);
    });
  }, [challenges, filters]);
  const stats = useMemo(() => {
    const totalQuality = challenges.reduce((sum, challenge) => sum + Number(challenge.qualityScore?.score ?? 0), 0);

    return {
      drafts: challenges.filter((challenge) => challenge.status === "draft").length,
      open: challenges.filter((challenge) => challenge.status === "open").length,
      quality: challenges.length > 0 ? Math.round(totalQuality / challenges.length) : 0,
      total: challenges.length,
    };
  }, [challenges]);
  const actionState = {
    isArchiving: archiveMutation.isPending,
    isClosing: closeMutation.isPending,
    isPausing: pauseMutation.isPending,
    isPublishing: publishMutation.isPending,
  };

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function resetFilters() {
    setFilters({ category: "", q: "", sort: "newest", status: "all", visibility: "all" });
  }

  return (
    <div className="grid gap-6">
      <PageHeader
        actions={
          <Button as={Link} to={ROUTES.NEW_CHALLENGE}>
            <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
            Create Challenge
          </Button>
        }
        description="Create measurable outcome challenges with clear success criteria, timeline, budget, and proof requirements."
        eyebrow="Client Challenge Workspace"
        title="My Challenges"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total challenges" value={stats.total} />
        <StatCard label="Open challenges" value={stats.open} />
        <StatCard label="Draft challenges" value={stats.drafts} />
        <StatCard label="Average quality score" value={`${stats.quality}/100`} />
      </div>

      <Card padding="md" variant="default">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_repeat(4,minmax(0,1fr))_auto] lg:items-end">
          <Input
            label="Search challenges"
            onChange={(event) => updateFilter("q", event.target.value)}
            placeholder="Search by outcome, proof, or title"
            type="search"
            value={filters.q}
          />
          <Select
            label="Status"
            onChange={(event) => updateFilter("status", event.target.value)}
            options={statusOptions}
            placeholder=""
            value={filters.status}
          />
          <Input
            label="Category"
            onChange={(event) => updateFilter("category", event.target.value)}
            placeholder="CRM Automation"
            value={filters.category}
          />
          <Select
            label="Visibility"
            onChange={(event) => updateFilter("visibility", event.target.value)}
            options={visibilityOptions}
            placeholder=""
            value={filters.visibility}
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
            <Skeleton className="h-72" key={index} />
          ))}
        </div>
      ) : null}

      {!challengesQuery.isLoading && !challengesQuery.isError && challenges.length === 0 ? (
        <ChallengeEmptyState />
      ) : null}

      {!challengesQuery.isLoading && !challengesQuery.isError && challenges.length > 0 && filteredChallenges.length === 0 ? (
        <Card padding="lg" variant="bordered">
          <h2 className="text-2xl font-black text-[#1C1917]">No challenges match these filters</h2>
          <p className="mt-2 text-sm leading-6 text-[#78716C]">
            Adjust search, status, visibility, or category filters to see more challenges.
          </p>
          <Button className="mt-5" onClick={resetFilters} type="button" variant="outline">
            Clear filters
          </Button>
        </Card>
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
