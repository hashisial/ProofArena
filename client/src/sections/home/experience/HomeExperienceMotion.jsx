import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export function HomeExperienceMotion({ children }) {
  const rootRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !rootRef.current) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    let animationFrame;

    function frame(time) {
      lenis.raf(time);
      animationFrame = window.requestAnimationFrame(frame);
    }

    animationFrame = window.requestAnimationFrame(frame);
    lenis.on("scroll", ScrollTrigger.update);

    const context = gsap.context(() => {
      gsap.utils.toArray("[data-story-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 28 },
          {
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              end: "top 58%",
              once: true,
              start: "top 86%",
              trigger: element,
            },
            y: 0,
          },
        );
      });

      gsap.utils.toArray("[data-story-line]").forEach((element) => {
        gsap.fromTo(
          element,
          { scaleX: 0 },
          {
            duration: 1.2,
            ease: "power3.out",
            scaleX: 1,
            scrollTrigger: {
              once: true,
              start: "top 88%",
              trigger: element,
            },
          },
        );
      });
    }, rootRef);

    ScrollTrigger.refresh();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      context.revert();
      lenis.destroy();
    };
  }, [reduceMotion]);

  return <div ref={rootRef}>{children}</div>;
}
