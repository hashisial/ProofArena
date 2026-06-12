import { motion, useReducedMotion } from "framer-motion";
import { Building2, FileCheck2, ShieldCheck, UsersRound } from "lucide-react";
import { Container } from "../../components/Container.jsx";
import { getRevealMotionProps } from "../../utils/motion.js";

const MotionDiv = motion.div;

const trustGroups = [
  {
    description: "Launch measurable goals instead of browsing endless profiles.",
    icon: Building2,
    label: "For outcome-driven clients",
    shortLabel: "Outcome Challenges",
  },
  {
    description: "Win trust by showing execution, not just claiming expertise.",
    icon: UsersRound,
    label: "For proof-based providers",
    shortLabel: "Execution Plans",
  },
  {
    description: "Track milestones, proof, and accountability in one workspace.",
    icon: ShieldCheck,
    label: "For delivery teams",
    shortLabel: "Milestone Tracking",
  },
  {
    description: "Build reputation from approved proof and completed goals.",
    icon: FileCheck2,
    label: "For verified outcomes",
    shortLabel: "Verified Proof",
  },
];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

export function TrustStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-y border-black bg-[#1C1917] py-8 text-white sm:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(63, 98, 18, 0.34),transparent_28%),radial-gradient(circle_at_90%_40%,rgba(101, 163, 13, 0.18),transparent_24%)]" />
      <Container>
        <div className="relative z-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {trustGroups.map((item, index) => {
            const Icon = item.icon;

            return (
              <MotionDiv
                className="premium-motion-card group flex min-w-0 items-start gap-4 rounded-3xl border border-white/12 bg-white/8 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#65A30D]/70 hover:bg-white/12 sm:p-5"
                key={item.label}
                {...getMotionProps(reduceMotion, index * 0.04)}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white text-[#365314] transition duration-300 group-hover:bg-[#65A30D] group-hover:text-white">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#65A30D]">
                    {item.shortLabel}
                  </p>
                  <h3 className="mt-2 break-words text-base font-black leading-6 text-white">
                    {item.label}
                  </h3>
                  <p className="mt-2 break-words text-sm leading-6 text-white/68">
                    {item.description}
                  </p>
                </div>
              </MotionDiv>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
