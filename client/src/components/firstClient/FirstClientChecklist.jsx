import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";

const checklistItems = Object.freeze([
  ["profileCompleted", "Complete profile", "Headline, bio, and skills are clear."],
  ["outcomeOfferCreated", "Create outcome offer", "Package a measurable result."],
  ["proofAssetAdded", "Add proof asset", "Store reusable proof in the vault."],
  ["executionPlanSubmitted", "Submit execution plan", "Apply with milestones, proof, timeline, and price."],
  ["shortlistedOnce", "Get shortlisted", "Earn a client shortlist signal."],
  ["firstChallengeWon", "Win first challenge", "Move from applying to winning."],
  ["firstVerifiedOutcome", "First verified outcome", "Future proof-review milestone."],
]);

export function FirstClientChecklist({ checklist = {} }) {
  return (
    <Card className="h-full" variant="bordered">
      <CardHeader>
        <CardTitle>Setup checklist</CardTitle>
        <CardDescription>
          Professional milestones that move a new provider toward a proof-backed client win.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {checklistItems.map(([key, label, description]) => {
          const complete = Boolean(checklist[key]);
          const Icon = complete ? CheckCircle2 : Circle;

          return (
            <div className="flex gap-3 rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4" key={key}>
              <Icon
                aria-hidden="true"
                className={complete ? "mt-0.5 h-5 w-5 shrink-0 text-[#7C3AED]" : "mt-0.5 h-5 w-5 shrink-0 text-[#A69AB5]"}
              />
              <div className="min-w-0">
                <p className="text-sm font-black text-[#07030D]">{label}</p>
                <p className="mt-1 text-sm leading-6 text-[#6F657C]">{description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
