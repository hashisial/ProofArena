import { Badge } from "../ui/Badge.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";

function CoverageGroup({ emptyText, items = [], title }) {
  return (
    <div className="rounded-2xl border border-[#E7E5E4] bg-white p-4">
      <p className="text-sm font-black text-[#1C1917]">{title}</p>
      {items.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <Badge key={item.label} variant="green">
              {item.label}: {item.count} {item.count === 1 ? "asset" : "assets"}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm leading-6 text-[#78716C]">{emptyText}</p>
      )}
    </div>
  );
}

function GapGroup({ items = [], title }) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[#A16207]/20 bg-[#FEF3C7] p-4">
      <p className="text-sm font-black text-[#854D0E]">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.slice(0, 10).map((item) => <Badge key={item} variant="secondary">{item}</Badge>)}
      </div>
    </div>
  );
}

export function ProofCategoryCoverage({ coverage = {} }) {
  return (
    <Card as="section" padding="lg" variant="bordered">
      <CardHeader>
        <CardTitle>Proof coverage</CardTitle>
        <CardDescription>See what your evidence supports and where active offers, plans, or profile skills still lack proof.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-3 md:grid-cols-3">
          <CoverageGroup emptyText="No proof categories added." items={coverage.categoryCounts} title="Covered categories" />
          <CoverageGroup emptyText="No proof skills added." items={coverage.skillCounts} title="Covered skills" />
          <CoverageGroup emptyText="No proof tools added." items={coverage.toolCounts} title="Covered tools" />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <GapGroup items={coverage.uncoveredCategories} title="Priority categories without proof" />
          <GapGroup items={coverage.uncoveredSkills} title="Priority skills without proof" />
          <GapGroup items={coverage.uncoveredTools} title="Priority tools without proof" />
        </div>
        {!coverage.uncoveredCategories?.length && !coverage.uncoveredSkills?.length && !coverage.uncoveredTools?.length ? (
          <p className="rounded-2xl border border-[#65A30D]/20 bg-[#F7FEE7] p-4 text-sm font-bold leading-6 text-[#3F6212]">
            Current proof coverage aligns with the active skills, categories, and tools available from your profile, offers, and plans.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
