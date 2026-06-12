import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";

const checklistItems = Object.freeze([
  ["profileCompleted", "Complete profile", "Bio, public profile, and core work history are clear."],
  ["headlineAdded", "Add headline", "Use a specific outcome-focused provider headline."],
  ["skillsAdded", "Add skills", "List the skills clients can match to challenges."],
  ["proofAssetAdded", "Upload first proof asset", "Store reusable evidence in the Proof Vault."],
  ["outcomeOfferCreated", "Publish first outcome offer", "Package a measurable result clients can understand."],
  ["availabilityEnabled", "Enable availability", "Make it clear whether you can take on challenge work."],
  ["challengeSaved", "Save first challenge", "Keep one first-client opportunity ready for follow-up."],
  ["executionPlanSubmitted", "Submit first execution plan", "Apply with milestones, proof, timeline, and price."],
  ["proofReadyProfile", "Build proof-ready profile", "Connect profile, offer, and proof signals into one trust story."],
  ["shortlistedOnce", "Reach first shortlist", "Earn the first client shortlist signal."],
]);

function normalizeChecklistItems(checklist = {}, items = null) {
  if (Array.isArray(items) && items.length > 0) {
    return items;
  }

  return checklistItems.map(([key, label, description]) => ({
    complete: Boolean(checklist[key]),
    description,
    key,
    label,
  }));
}

export function FirstClientChecklist({ checklist = {}, items = null }) {
  const normalizedItems = normalizeChecklistItems(checklist, items);
  const completeCount = normalizedItems.filter((item) => item.complete).length;
  const progress = normalizedItems.length > 0
    ? Math.round((completeCount / normalizedItems.length) * 100)
    : 0;

  return (
    <Card className="h-full" variant="bordered">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>First-client checklist</CardTitle>
            <CardDescription>
              Concrete setup steps that move a new provider toward a proof-backed client win.
            </CardDescription>
          </div>
          <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] px-4 py-3 text-right">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#78716C]">Progress</p>
            <p className="mt-1 text-2xl font-black text-[#1C1917]">{progress}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          aria-label={`First client checklist progress ${progress} percent`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          className="h-3 overflow-hidden rounded-full bg-[#E7E5E4]"
          role="progressbar"
        >
          <div className="h-full rounded-full bg-[#3F6212] transition-[width]" style={{ width: `${progress}%` }} />
        </div>
        <ul className="mt-5 grid gap-3">
          {normalizedItems.map(({ complete, description, key, label }) => {
            const Icon = complete ? CheckCircle2 : Circle;

            return (
              <li className="flex gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={key}>
                <Icon
                  aria-hidden="true"
                  className={complete ? "mt-0.5 h-5 w-5 shrink-0 text-[#3F6212]" : "mt-0.5 h-5 w-5 shrink-0 text-[#A8A29E]"}
                />
                <div className="min-w-0">
                  <p className="text-sm font-black text-[#1C1917]">{label}</p>
                  <p className="mt-1 text-sm leading-6 text-[#78716C]">{description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
