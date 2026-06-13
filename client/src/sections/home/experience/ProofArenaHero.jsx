import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Badge } from "../../../components/ui/Badge.jsx";
import { Button } from "../../../components/Button.jsx";
import { Container } from "../../../components/Container.jsx";
import { ROUTES } from "../../../constants/index.js";
import { getRevealMotionProps } from "../../../utils/motion.js";

const ProofEcosystemScene = lazy(() =>
  import("./ProofEcosystemScene.jsx").then((module) => ({
    default: module.ProofEcosystemScene,
  })),
);
const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionUl = motion.ul;

const trustSignals = [
  { icon: BadgeCheck, label: "Verified outcomes" },
  { icon: Gauge, label: "Proof score" },
  { icon: Target, label: "Outcome matching" },
];

const ecosystemCards = [
  {
    depth: 24,
    icon: Target,
    label: "Outcome challenge",
    meta: "Success criteria locked",
    title: "Launch a measurable growth system",
  },
  {
    depth: 38,
    icon: ClipboardCheck,
    label: "Execution plan",
    meta: "4 milestones defined",
    title: "Structured delivery before selection",
  },
  {
    depth: 30,
    icon: FileCheck2,
    label: "Proof verification",
    meta: "Evidence approved",
    title: "Results checked against requirements",
  },
  {
    depth: 46,
    icon: ShieldCheck,
    label: "Match score",
    meta: "Proof-backed fit",
    title: "94% outcome alignment",
  },
  {
    depth: 32,
    icon: Gauge,
    label: "Trust score",
    meta: "Verified execution history",
    title: "92 proof reputation",
  },
];

function EcosystemCards() {
  const stageRef = useRef(null);
  const frameRef = useRef(null);

  function moveCards(event) {
    if (!stageRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      const bounds = stageRef.current.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      stageRef.current.querySelectorAll("[data-depth]").forEach((card) => {
        const depth = Number(card.dataset.depth);
        card.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0) rotateX(${-y * 5}deg) rotateY(${x * 7}deg)`;
      });
    });
  }

  function resetCards() {
    stageRef.current?.querySelectorAll("[data-depth]").forEach((card) => {
      card.style.transform = "translate3d(0, 0, 0) rotateX(0) rotateY(0)";
    });
  }

  return (
    <div
      className="hero-ecosystem-cards"
      onMouseLeave={resetCards}
      onMouseMove={moveCards}
      ref={stageRef}
    >
      {ecosystemCards.map((card, index) => {
        const Icon = card.icon;

        return (
          <article
            className={`hero-ecosystem-card hero-ecosystem-card-${index + 1}`}
            data-depth={card.depth}
            key={card.label}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/10 text-[#D9F99D]">
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="text-[0.64rem] font-black uppercase text-white/45">
                Live architecture
              </span>
            </div>
            <p className="mt-4 text-[0.66rem] font-black uppercase text-[#D9F99D]">{card.label}</p>
            <h2 className="mt-2 text-sm font-black leading-5 text-white sm:text-base">{card.title}</h2>
            <p className="mt-3 text-xs font-semibold text-white/55">{card.meta}</p>
          </article>
        );
      })}
    </div>
  );
}

export function ProofArenaHero() {
  const reduceMotion = useReducedMotion();
  const [showScene, setShowScene] = useState(false);
  const getHeroRevealProps = (options) => {
    const props = getRevealMotionProps(reduceMotion, options);

    if (reduceMotion) {
      return props;
    }

    return {
      ...props,
      animate: "visible",
      whileInView: undefined,
    };
  };

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");

    function syncSceneVisibility() {
      setShowScene(query.matches);
    }

    syncSceneVisibility();
    query.addEventListener("change", syncSceneVisibility);

    return () => query.removeEventListener("change", syncSceneVisibility);
  }, []);

  return (
    <section aria-labelledby="proofarena-home-title" className="proof-hero relative min-h-[calc(100svh-4rem)] overflow-hidden bg-[#1C1917] text-white">
      <div className="absolute inset-0 hidden lg:block">
        {showScene && !reduceMotion ? (
          <Suspense fallback={<div className="h-full w-full bg-[#1C1917]" />}>
            <ProofEcosystemScene />
          </Suspense>
        ) : null}
      </div>
      <div aria-hidden="true" className="proof-hero-grid absolute inset-0" />
      <Container className="relative z-10 grid min-h-[calc(100svh-4rem)] gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:py-16">
        <div className="max-w-3xl">
          <MotionDiv {...getHeroRevealProps()}>
            <Badge className="border-white/15 bg-white/10 text-[#ECFCCB]" variant="outline">
              Proof-based outcome economy
            </Badge>
          </MotionDiv>
          <MotionH1
            className="mt-6 text-[2.8rem] font-black leading-[0.98] text-white [text-wrap:balance] sm:text-6xl lg:text-7xl xl:text-[5.4rem]"
            id="proofarena-home-title"
            {...getHeroRevealProps({ delay: 0.07 })}
          >
            Launch measurable outcomes.
            <span className="mt-2 block text-[#D9F99D]">Verify execution.</span>
          </MotionH1>
          <MotionP
            className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/68 sm:text-lg"
            {...getHeroRevealProps({ delay: 0.14 })}
          >
            ProofArena is a verified execution platform where clients define measurable
            outcomes, providers compete through execution plans, and trust is earned from
            reviewed proof.
          </MotionP>
          <MotionDiv
            className="mt-8 grid gap-3 sm:max-w-xl sm:grid-cols-2"
            {...getHeroRevealProps({ delay: 0.2 })}
          >
            <div className="min-w-0">
              <Button
                as="a"
                className="magnetic-action w-full border-[#D9F99D] bg-[#D9F99D] text-[#1C1917] hover:border-white hover:bg-white hover:text-[#1C1917]"
                href={ROUTES.REGISTER}
              >
                Create Challenge
                <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
              </Button>
              <p className="mt-2 text-xs font-semibold leading-5 text-white/48">
                For clients hiring a measurable result.
              </p>
            </div>
            <div className="min-w-0">
              <Button
                as="a"
                className="magnetic-action w-full border-white/22 bg-white/8 text-white hover:border-white/50 hover:bg-white/14 hover:text-white"
                href={ROUTES.REGISTER}
                variant="secondary"
              >
                Become a Provider
              </Button>
              <p className="mt-2 text-xs font-semibold leading-5 text-white/48">
                For providers ready to prove execution.
              </p>
            </div>
          </MotionDiv>
          <MotionUl
            className="mt-8 grid gap-3 sm:grid-cols-3"
            {...getHeroRevealProps({ delay: 0.26 })}
          >
            {trustSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <li className="flex items-center gap-2 text-xs font-black text-white/62" key={signal.label}>
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-[#D9F99D]" />
                  {signal.label}
                </li>
              );
            })}
          </MotionUl>
        </div>

        <MotionDiv
          className="relative min-h-[25rem] lg:min-h-[39rem]"
          {...getHeroRevealProps({ delay: 0.2 })}
        >
          <EcosystemCards />
        </MotionDiv>
      </Container>
      <div className="relative z-10 border-t border-white/10 bg-white/[0.035] py-4 backdrop-blur">
        <Container className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-black uppercase text-white/42">ProofArena by ScaleOps</p>
          <p className="text-xs font-bold text-white/58">Proof over promises. Outcomes over activity.</p>
        </Container>
      </div>
    </section>
  );
}
