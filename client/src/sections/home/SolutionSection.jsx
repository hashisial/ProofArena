import { ArrowRight, FileCheck2, Flag, ListChecks, Trophy } from "lucide-react";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

const solutionFlow = [
  {
    icon: Flag,
    title: "Goal becomes challenge",
    text: "Clients define the measurable business result, acceptance criteria, and proof requirements.",
  },
  {
    icon: ListChecks,
    title: "Provider submits plan",
    text: "Providers compete with execution strategy, milestone logic, and evidence expectations.",
  },
  {
    icon: FileCheck2,
    title: "Proof is reviewed",
    text: "Completed work is checked against the outcome instead of relying on vague status updates.",
  },
  {
    icon: Trophy,
    title: "Reputation is earned",
    text: "Provider credibility grows from verified execution, not promises or inflated profiles.",
  },
];

export function SolutionSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionHeader
          align="center"
          badge="ProofArena approach"
          description="A structured workflow connects goals, execution, milestones, proof review, and proof-based reputation in one outcome workspace."
          title="From business goal to verified result."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          {solutionFlow.map((item, index) => {
            const Icon = item.icon;

            return (
              <div className="relative rounded-3xl border border-[#E9E2F3] bg-white p-5 shadow-[0_16px_50px_rgba(31, 14, 54, 0.05)]" key={item.title}>
                <div className="flex items-center justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6]">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <Badge variant="outline">0{index + 1}</Badge>
                </div>
                <h3 className="mt-6 text-xl font-black text-[#07030D]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6F657C]">{item.text}</p>
                {index < solutionFlow.length - 1 ? (
                  <ArrowRight aria-hidden="true" className="absolute -right-3 top-10 hidden h-6 w-6 rounded-full bg-white text-[#7C3AED] lg:block" />
                ) : null}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
