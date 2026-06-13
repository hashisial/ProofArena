import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { Container } from "../components/Container.jsx";
import { ChallengeCard } from "../components/challenges/ChallengeCard.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Select } from "../components/ui/Select.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";
import { ROUTES } from "../constants/index.js";
import { usePublicChallenges } from "../features/challenges/useChallenges.js";
import { getChallengeApiErrorMessage } from "../features/challenges/challengeUtils.js";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Relevance", value: "relevance" },
  { label: "Budget low", value: "budget_low" },
  { label: "Budget high", value: "budget_high" },
  { label: "Urgent", value: "urgent" },
  { label: "Most plans", value: "most_plans" },
  { label: "Quality score", value: "quality_score" },
];

const urgencyOptions = [
  { label: "Any urgency", value: "" },
  { label: "Low", value: "low" },
  { label: "Normal", value: "normal" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];

export function Challenges() {
  const [filters, setFilters] = useState({
    category: "",
    maxBudget: "",
    minBudget: "",
    q: "",
    skill: "",
    sort: "newest",
    urgency: "",
  });
  const queryFilters = useMemo(() => ({
    category: filters.category,
    maxBudget: filters.maxBudget,
    minBudget: filters.minBudget,
    q: filters.q,
    skill: filters.skill,
    sort: filters.sort,
    urgency: filters.urgency,
  }), [filters]);
  const challengesQuery = usePublicChallenges(queryFilters);
  const challenges = challengesQuery.data?.items ?? [];

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function resetFilters() {
    setFilters({ category: "", maxBudget: "", minBudget: "", q: "", skill: "", sort: "newest", urgency: "" });
  }

  return (
    <section className="bg-[#FFFFFF] py-8 text-[#1C1917] sm:py-12">
      <Container>
        <div className="mx-auto grid max-w-7xl gap-6">
          <Card className="rounded-3xl" padding="lg" variant="elevated">
            <Badge variant="primary">Outcome challenges</Badge>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-normal text-[#1C1917] sm:text-5xl">
              Outcome Challenges
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#57534E]">
              Browse measurable business challenges with clear goals, timelines, proof requirements, and execution-plan opportunities.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button as="a" href={ROUTES.REGISTER}>Create a Challenge</Button>
              <Button as="a" href={ROUTES.PROVIDERS} variant="outline">Explore Providers</Button>
            </div>
          </Card>

          <Card padding="md" variant="default">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_repeat(5,minmax(0,1fr))_auto] lg:items-end">
              <Input
                label="Search challenges"
                leftIcon={<Search className="h-4 w-4" />}
                onChange={(event) => updateFilter("q", event.target.value)}
                placeholder="Search by outcome, skill, or proof"
                type="search"
                value={filters.q}
              />
              <Input
                label="Category"
                onChange={(event) => updateFilter("category", event.target.value)}
                placeholder="CRM Automation"
                value={filters.category}
              />
              <Input
                label="Skill"
                onChange={(event) => updateFilter("skill", event.target.value)}
                placeholder="Data Cleaning"
                value={filters.skill}
              />
              <Input
                label="Min budget"
                min="0"
                onChange={(event) => updateFilter("minBudget", event.target.value)}
                placeholder="500"
                type="number"
                value={filters.minBudget}
              />
              <Input
                label="Max budget"
                min="0"
                onChange={(event) => updateFilter("maxBudget", event.target.value)}
                placeholder="2000"
                type="number"
                value={filters.maxBudget}
              />
              <Select
                label="Urgency"
                onChange={(event) => updateFilter("urgency", event.target.value)}
                options={urgencyOptions}
                placeholder=""
                value={filters.urgency}
              />
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-1">
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
            </div>
          </Card>

          {challengesQuery.isError ? (
            <Card padding="lg" variant="bordered">
              <Badge variant="red">Could not load challenges</Badge>
              <h2 className="mt-3 text-2xl font-black text-[#1C1917]">Outcome challenges unavailable</h2>
              <p className="mt-2 text-sm leading-6 text-[#78716C]">
                {getChallengeApiErrorMessage(challengesQuery.error, "Challenge discovery could not be loaded. Please try again.")}
              </p>
              <Button className="mt-5" onClick={() => challengesQuery.refetch()} type="button">
                Retry
              </Button>
            </Card>
          ) : null}

          {challengesQuery.isLoading ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton className="h-72" key={index} />
              ))}
            </div>
          ) : null}

          {!challengesQuery.isLoading && !challengesQuery.isError && challenges.length === 0 ? (
            <EmptyState
              actionHref={ROUTES.PROVIDERS}
              actionText="Explore Providers"
              description="No open challenges match these filters yet. Adjust search terms or browse providers while new challenge data comes online."
              icon={Search}
              title="No open challenges found"
              variant="spotlight"
            />
          ) : null}

          {challenges.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {challenges.map((challenge) => (
                <ChallengeCard
                  challenge={challenge}
                  key={challenge.id ?? challenge._id ?? challenge.slug}
                  variant="public"
                />
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
