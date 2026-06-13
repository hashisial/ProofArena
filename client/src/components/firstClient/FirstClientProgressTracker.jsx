import { CheckCircle2, CircleDashed } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";

const milestoneDescriptions = Object.freeze({
  challengeSaved: "One challenge has been saved or applied to from matched opportunities.",
  firstClientWon: "A first accepted challenge will close the first-client loop.",
  firstPlanSubmitted: "At least one structured execution plan has been submitted.",
  firstShortlist: "A client has shortlisted one of your execution plans.",
  offerReady: "An outcome offer exists for clients to understand your measurable result.",
  profileReady: "Profile, headline, and skills are ready enough for client review.",
  proofReady: "At least one proof asset is available to support claims.",
});

export function FirstClientProgressTracker({ milestones = [] }) {
  const completed = milestones.filter((milestone) => milestone.complete).length;

  return (
    <Card className="h-full" variant="bordered">
      <CardHeader>
        <CardTitle>Progress Tracker</CardTitle>
        <CardDescription>
          Follow the path from setup to first shortlist and first client win without fake achievements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
          <p className="text-sm font-bold text-[#78716C]">Milestones complete</p>
          <p className="mt-2 text-3xl font-black text-[#1C1917]">
            {completed}/{milestones.length}
          </p>
        </div>
        <ol className="mt-5 grid gap-3">
          {milestones.map((milestone, index) => {
            const Icon = milestone.complete ? CheckCircle2 : CircleDashed;

            return (
              <li className="relative flex gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-4" key={milestone.key}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F7FEE7] text-[#3F6212]">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-[#1C1917]">
                    {index + 1}. {milestone.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#78716C]">
                    {milestone.description ?? milestoneDescriptions[milestone.key] ?? "Milestone status is based on current provider data."}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
