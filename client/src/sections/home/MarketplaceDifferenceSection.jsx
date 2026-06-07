import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Layers3,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps } from "../../utils/motion.js";

const MotionDiv = motion.div;
const MotionArticle = motion.article;

const comparisonCards = [
  {
    badge: "Traditional platforms",
    icon: ClipboardList,
    points: [
      "Providers chase hundreds of jobs",
      "Clients receive proposal spam",
      "Reviews can be vague",
      "Trust is hard to verify",
    ],
    title: "Normal marketplaces",
    tone: "neutral",
  },
  {
    badge: "ProofArena model",
    icon: ShieldCheck,
    points: [
      "Clients post outcome challenges",
      "Providers submit execution plans",
      "Work is tracked by milestones",
      "Approved proof builds reputation",
    ],
    title: "ProofArena",
    tone: "olive",
  },
  {
    badge: "What changes",
    icon: Gauge,
    points: [
      "Better provider matching",
      "Clearer client decisions",
      "Less wasted selling time",
      "Reputation backed by evidence",
    ],
    title: "Result",
    tone: "bronze",
  },
];

const toneClasses = {
  bronze: {
    badge: "secondary",
    card: "border-[#6D28D9]/25 bg-[linear-gradient(135deg,#FFFFFF_0%,#F8F4FF_58%,#FEF3C7_100%)]",
    icon: "bg-[#FEF3C7] text-[#6D28D9]",
    pointIcon: "text-[#6D28D9]",
  },
  neutral: {
    badge: "gray",
    card: "border-[#E9E2F3] bg-white",
    icon: "bg-[#F8F4FF] text-[#493C5E]",
    pointIcon: "text-[#6F657C]",
  },
  olive: {
    badge: "primary",
    card: "border-[#A78BFA]/35 bg-[linear-gradient(135deg,#FFFFFF_0%,#F8F4FF_50%,#F5F3FF_100%)]",
    icon: "bg-[#F5F3FF] text-[#5B21B6]",
    pointIcon: "text-[#7C3AED]",
  },
};

function getMotionProps(reduceMotion, delay = 0) {
  return getRevealMotionProps(reduceMotion, { delay });
}

function DifferenceCard({ card, index, reduceMotion }) {
  const Icon = card.icon;
  const tone = toneClasses[card.tone];

  return (
    <MotionArticle
      {...getMotionProps(reduceMotion, 0.08 + index * 0.06)}
      className="min-w-0"
    >
      <Card
        as="article"
        className={`premium-motion-card group h-full rounded-[1.7rem] transition duration-300 hover:-translate-y-1 hover:border-[#A78BFA] hover:shadow-[0_24px_76px_rgba(124,58,237,0.14)] ${tone.card}`}
        padding="lg"
        variant="default"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tone.icon}`}>
            <Icon aria-hidden="true" className="h-6 w-6" />
          </span>
          <Badge variant={tone.badge}>{card.badge}</Badge>
        </div>

        <h3 className="mt-6 break-words text-2xl font-black leading-tight text-[#07030D]">
          {card.title}
        </h3>

        <ul className="mt-6 grid gap-3">
          {card.points.map((point) => (
            <li className="flex items-start gap-3" key={point}>
              <CheckCircle2 aria-hidden="true" className={`mt-0.5 h-5 w-5 shrink-0 ${tone.pointIcon}`} />
              <span className="text-sm font-semibold leading-7 text-[#493C5E]">{point}</span>
            </li>
          ))}
        </ul>
      </Card>
    </MotionArticle>
  );
}

export function MarketplaceDifferenceSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#F8F4FF_0%,#FBF9FF_48%,#FFFFFF_100%)] py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_16%_16%,rgba(124,58,237,0.12),transparent_32%),radial-gradient(circle_at_88%_42%,rgba(109,40,217,0.1),transparent_28%)]" />
      <Container className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <MotionDiv {...getMotionProps(reduceMotion, 0)}>
            <Badge variant="primary">Why ProofArena is different</Badge>
            <h2 className="mt-4 max-w-4xl break-words text-3xl font-black leading-tight text-[#07030D] [text-wrap:balance] sm:text-4xl lg:text-5xl">
              Not another profile marketplace.
            </h2>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-[#6F657C] sm:text-lg">
              ProofArena is built around measurable outcomes, execution plans,
              milestones, and verified proof - so providers can win work through
              evidence and clients can hire with more confidence.
            </p>
          </MotionDiv>

          <MotionDiv
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end"
            {...getMotionProps(reduceMotion, 0.08)}
          >
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.REGISTER}>
              Become a Provider
              <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
            </Button>
            <Button as="a" className="w-full sm:w-auto" href={ROUTES.CHALLENGES} variant="secondary">
              Explore Challenges
            </Button>
          </MotionDiv>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {comparisonCards.map((card, index) => (
            <DifferenceCard
              card={card}
              index={index}
              key={card.title}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        <MotionDiv
          className="mt-8 grid gap-4 rounded-3xl border border-[#E9E2F3] bg-white p-5 shadow-[0_16px_50px_rgba(31,14,54,0.04)] sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start"
          {...getMotionProps(reduceMotion, 0.28)}
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F5F3FF] text-[#5B21B6]">
            <Target aria-hidden="true" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-black leading-6 text-[#07030D]">Less selling. More proof.</p>
            <p className="mt-1 text-sm font-semibold leading-7 text-[#6F657C]">
              Clients compare plans and proof, not empty claims. Providers build
              reputation that compounds after every approved outcome.
            </p>
          </div>
        </MotionDiv>
      </Container>
    </section>
  );
}
