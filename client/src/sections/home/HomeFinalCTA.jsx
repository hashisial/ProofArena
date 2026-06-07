import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileCheck2,
  Flag,
  Layers3,
  ShieldCheck,
  Target,
  Trophy,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps } from "../../utils/motion.js";

const MotionDiv = motion.div;
const MotionArticle = motion.article;

const conversionCards = [
  {
    bullets: ["Measurable goal", "Execution plans", "Proof review"],
    cta: "Create a Challenge",
    description:
      "Define the result, timeline, budget, milestones, and proof requirements before work starts.",
    href: ROUTES.REGISTER,
    icon: Flag,
    label: "For clients",
    title: "Launch an outcome challenge",
  },
  {
    bullets: ["Public profile", "Proof score", "Leaderboard visibility"],
    cta: "Join as Provider",
    description:
      "Submit plans, complete milestones, upload proof, and grow a reputation backed by verified outcomes.",
    href: ROUTES.REGISTER,
    icon: UserRoundCheck,
    label: "For providers",
    title: "Prove your execution",
  },
];

const decorativeBadges = ["Outcome", "Plan", "Milestone", "Proof", "Score"];

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function ConversionCard({ card, index, reduceMotion }) {
  const Icon = card.icon;

  return (
    <MotionArticle
      {...getMotionProps(reduceMotion, 0.16 + index * 0.06)}
      className="min-w-0"
    >
      <Card
        as="article"
        className="premium-motion-card group h-full rounded-[1.7rem] transition duration-300 hover:-translate-y-1 hover:border-[#A78BFA] hover:shadow-[0_24px_76px_rgba(124,58,237,0.14)]"
        padding="lg"
        variant="default"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6] transition group-hover:bg-[#7C3AED] group-hover:text-white">
            <Icon aria-hidden="true" className="h-6 w-6" />
          </span>
          <Badge variant={index === 0 ? "primary" : "secondary"}>{card.label}</Badge>
        </div>

        <h3 className="mt-6 break-words text-2xl font-black leading-tight text-[#07030D]">
          {card.title}
        </h3>
        <p className="mt-3 text-sm font-semibold leading-7 text-[#6F657C]">
          {card.description}
        </p>

        <ul className="mt-6 grid gap-3 rounded-3xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
          {card.bullets.map((bullet) => (
            <li className="flex items-start gap-3 text-sm font-black leading-6 text-[#07030D]" key={bullet}>
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#7C3AED]" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <Button as="a" className="w-full" href={card.href} variant={index === 0 ? "primary" : "secondary"}>
            {card.cta}
            <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
          </Button>
        </div>
      </Card>
    </MotionArticle>
  );
}

export function HomeFinalCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#FFFFFF_0%,#FBF9FF_40%,#F8F4FF_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_16%_12%,rgba(124,58,237,0.12),transparent_34%),radial-gradient(circle_at_86%_58%,rgba(109,40,217,0.1),transparent_30%)]" />
      <Container className="relative z-10">
        <MotionDiv
          className="premium-tilt premium-motion-card relative overflow-hidden rounded-[2rem] border border-[#C4B5FD]/70 bg-[linear-gradient(135deg,#7C3AED_0%,#5B21B6_48%,#12091F_100%)] p-6 text-white shadow-[0_34px_100px_rgba(124,58,237,0.34)] sm:p-8 lg:p-12"
          {...getRevealMotionProps(reduceMotion)}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_18%_4%,rgba(255,255,255,0.24),transparent_28%),radial-gradient(circle_at_86%_72%,rgba(109,40,217,0.28),transparent_30%)]"
          />
          <div aria-hidden="true" className="absolute inset-x-6 bottom-6 hidden flex-wrap justify-end gap-2 opacity-80 lg:flex">
            {decorativeBadges.map((item, index) => (
              <span
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black text-[#F5F3FF] backdrop-blur"
                key={item}
                style={{ transform: `translateY(${index % 2 === 0 ? "0" : "10px"})` }}
              >
                {item}
              </span>
            ))}
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.34fr)] lg:items-center">
            <div className="min-w-0 max-w-4xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#EDE9FE]">
                  <ShieldCheck aria-hidden="true" className="h-5 w-5" />
                </span>
                <Badge className="border-white/15 bg-white/10 text-[#F5F3FF]" variant="outline">
                  Ready to build with proof?
                </Badge>
              </div>

              <h2 className="mt-6 break-words text-3xl font-black leading-tight [text-wrap:balance] sm:text-5xl lg:text-6xl">
                Stop hiring promises. Start verifying outcomes.
              </h2>
              <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-white/80 sm:text-lg">
                Create measurable challenges, compare execution plans, track
                milestones, and build trust from approved proof.
              </p>
              <p className="mt-5 text-sm font-bold leading-7 text-[#EDE9FE]">
                Built for clients who want clarity and providers who want
                reputation that compounds.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  as="a"
                  className="w-full border-white bg-white text-[#7C3AED] hover:border-[#F8F4FF] hover:bg-[#F8F4FF] hover:text-[#5B21B6] sm:w-auto"
                  href={ROUTES.REGISTER}
                  variant="secondary"
                >
                  Create a Challenge
                  <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
                </Button>
                <Button
                  as="a"
                  className="w-full border-white/35 bg-white/10 text-white hover:border-white hover:bg-white/16 hover:text-white sm:w-auto"
                  href={ROUTES.REGISTER}
                  variant="outline"
                >
                  Join as Provider
                </Button>
                <a
                  className="inline-flex min-h-12 w-full max-w-full items-center justify-center rounded-full px-4 text-center text-sm font-black text-[#F5F3FF] underline-offset-4 transition hover:bg-white/10 hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-[#EDE9FE]/80 sm:w-auto"
                  href={ROUTES.PROOF_LEDGER}
                >
                  Explore Proof Ledger
                </a>
              </div>
            </div>

            <div className="grid gap-3 rounded-[1.7rem] border border-white/15 bg-white/10 p-4 backdrop-blur">
              {[
                { icon: Target, label: "Outcome challenge" },
                { icon: Layers3, label: "Milestone workflow" },
                { icon: FileCheck2, label: "Reviewed proof" },
                { icon: Trophy, label: "Proof-backed reputation" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/10 p-3"
                    key={item.label}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#EDE9FE]" />
                    <span className="text-sm font-black leading-6 text-white">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </MotionDiv>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {conversionCards.map((card, index) => (
            <ConversionCard
              card={card}
              index={index}
              key={card.label}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <MotionDiv
          className="mt-8 flex items-start gap-3 rounded-3xl border border-[#E9E2F3] bg-[#F8F4FF] p-5"
          {...getMotionProps(reduceMotion, 0.28)}
        >
          <BadgeCheck aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#7C3AED]" />
          <p className="text-sm font-semibold leading-7 text-[#6F657C]">
            This final CTA uses product workflow language only. It does not
            claim live usage, payments, outcomes, testimonials, or platform
            scale before those signals are connected.
          </p>
        </MotionDiv>
      </Container>
    </section>
  );
}
