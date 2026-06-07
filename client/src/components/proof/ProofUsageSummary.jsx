import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";

const METRICS = [
  ["Total assets", "total"],
  ["Public assets", "public"],
  ["Shareable assets", "shareable"],
  ["Attached to offers", "attachedToOffers"],
  ["Attached to plans", "attachedToPlans"],
  ["Unused assets", "unused"],
  ["Verified assets", "verified"],
];

export function ProofUsageSummary({ compact = false, usage = {} }) {
  return (
    <Card as="section" padding={compact ? "md" : "lg"} variant="bordered">
      <CardHeader>
        <CardTitle className={compact ? "text-lg" : ""}>Proof usage</CardTitle>
        <CardDescription>How your private evidence library is being prepared and reused.</CardDescription>
      </CardHeader>
      <CardContent className={`grid gap-3 ${compact ? "grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
        {METRICS.map(([label, key]) => (
          <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={key}>
            <p className="text-sm font-bold text-[#78716C]">{label}</p>
            <p className="mt-2 text-2xl font-black text-[#1C1917]">{Number(usage[key] ?? 0)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
