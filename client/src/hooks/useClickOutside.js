import { useEffect } from "react";

const DEFAULT_EVENTS = Object.freeze(["pointerdown"]);

function isEventInside(refs, target) {
  return refs.some((ref) => ref?.current?.contains?.(target));
}

export function useClickOutside(refOrRefs, onClickOutside, options = {}) {
  const enabled = options.enabled ?? true;
  const events = options.events ?? DEFAULT_EVENTS;

  useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      return undefined;
    }

    const refs = Array.isArray(refOrRefs) ? refOrRefs : [refOrRefs];

    function handleEvent(event) {
      if (!event.target || isEventInside(refs, event.target)) {
        return;
      }

      onClickOutside(event);
    }

    events.forEach((eventName) => document.addEventListener(eventName, handleEvent));

    return () => {
      events.forEach((eventName) => document.removeEventListener(eventName, handleEvent));
    };
  }, [enabled, events, onClickOutside, refOrRefs]);
}
