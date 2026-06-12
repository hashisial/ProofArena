import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileCheck2,
  Network,
  ShieldCheck,
  Target,
  Trophy,
  UsersRound,
} from "lucide-react";
import { Container } from "../../../components/Container.jsx";

const flywheelSteps = [
  {
    copy: "Clients publish measurable demand.",
    icon: Target,
    label: "More challenges",
  },
  {
    copy: "Qualified operators enter around outcome fit.",
    icon: UsersRound,
    label: "More providers",
  },
  {
    copy: "Execution becomes comparable before selection.",
    icon: ClipboardCheck,
    label: "Better plans",
  },
  {
    copy: "Evidence creates a transparent outcome history.",
    icon: FileCheck2,
    label: "More proof",
  },
  {
    copy: "Verified execution strengthens reputation.",
    icon: BadgeCheck,
    label: "More trust",
  },
  {
    copy: "Better matches create more completed outcomes.",
    icon: Trophy,
    label: "More outcomes",
  },
];

const defensibilitySignals = [
  {
    copy: "Every challenge, plan, and proof event improves the system's decision context.",
    icon: Network,
    label: "Structured execution data",
  },
  {
    copy: "Reputation is tied to approved outcomes instead of self-reported claims.",
    icon: ShieldCheck,
    label: "Compounding trust history",
  },
  {
    copy: "Better signals create better matching, stronger providers, and repeat demand.",
    icon: ArrowRight,
    label: "Outcome network effects",
  },
];

export function ProofArenaTrustFlywheel() {
  return (
    <section className="bg-[#151B0D] py-20 text-white sm:py-28 lg:py-36">
      <Container>
        <div className="grid gap-12 xl:grid-cols-[0.68fr_1.32fr] xl:items-center">
          <div data-story-reveal>
            <p className="text-xs font-black uppercase text-[#BEF264]">10 / Trust flywheel</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-black leading-[1.03] text-white [text-wrap:balance] sm:text-5xl lg:text-6xl">
              Every verified outcome makes the network more useful.
            </h2>
            <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-white/62">
              ProofArena compounds trust instead of resetting it. More outcome activity creates
              better signals, stronger reputation, better matching, and more valuable execution.
            </p>
            <div className="mt-8 grid gap-3">
              {defensibilitySignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <article className="flex gap-4 border-t border-white/14 pt-4" key={signal.label}>
                    <span className="grid h-10 w-10 shrink-0 place-items-center border border-[#BEF264]/25 bg-[#BEF264]/10 text-[#BEF264]">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-white">{signal.label}</h3>
                      <p className="mt-1 text-xs font-semibold leading-6 text-white/48">{signal.copy}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="trust-flywheel" data-story-reveal>
            <div className="trust-flywheel-core">
              <Network aria-hidden="true" className="h-6 w-6 text-[#BEF264]" />
              <p className="mt-3 text-xl font-black text-white">ProofArena</p>
              <p className="mt-1 text-xs font-black uppercase text-white/45">Outcome execution network</p>
            </div>
            <div className="trust-flywheel-track" aria-hidden="true" />
            <div className="trust-flywheel-steps">
              {flywheelSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article className={`trust-flywheel-step trust-flywheel-step-${index + 1}`} key={step.label}>
                    <span className="grid h-9 w-9 shrink-0 place-items-center border border-[#65A30D]/35 bg-[#F7FEE7] text-[#3F6212]">
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-xs font-black uppercase text-[#1C1917]">{step.label}</h3>
                      <p className="mt-1 text-[0.68rem] font-semibold leading-5 text-[#78716C]">{step.copy}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
