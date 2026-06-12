import { AlertTriangle, ClipboardList, EyeOff, Gauge, MessageSquareWarning } from "lucide-react";
import { Container } from "../../components/Container.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

const problems = [
  {
    icon: ClipboardList,
    title: "Proposal overload",
    text: "Teams waste time sorting through claims instead of comparing execution quality.",
  },
  {
    icon: EyeOff,
    title: "Hard-to-verify results",
    text: "Screenshots, reports, and delivery updates often live outside the trust system.",
  },
  {
    icon: Gauge,
    title: "Unclear provider quality",
    text: "Reputation is usually built from ratings, not measurable execution evidence.",
  },
  {
    icon: MessageSquareWarning,
    title: "Manual tracking",
    text: "Milestones, conversations, files, and proof become scattered across tools.",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-[#FAFAF9] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <SectionHeader
            badge="The old way breaks trust"
            description="Most platforms optimize for browsing profiles and sending messages. ProofArena is built around measurable outcomes, execution plans, milestone evidence, and verified proof."
            title="Work should not depend on claims that cannot be checked."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {problems.map((problem) => {
              const Icon = problem.icon;

              return (
                <Card className="h-full" key={problem.title} variant="default">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7FEE7] text-[#365314]">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-[#1C1917]">{problem.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#57534E]">{problem.text}</p>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-[#E7E5E4] bg-white p-5 shadow-[0_20px_60px_rgba(28, 25, 23, 0.06)] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#1C1917] text-white">
              <AlertTriangle aria-hidden="true" className="h-6 w-6" />
            </span>
            <p className="text-base leading-8 text-[#44403C]">
              ProofArena reframes work from "who sounds best" to "who can define,
              execute, and prove the outcome."
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
