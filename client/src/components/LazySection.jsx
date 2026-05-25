import { Suspense, useEffect, useRef, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner.jsx";

function isHashTarget(anchorId) {
  return Boolean(anchorId && window.location.hash === `#${anchorId}`);
}

export function LazySection({
  anchorId,
  children,
  fallbackLabel = "Loading section...",
  rootMargin = "360px",
}) {
  const containerRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(() => isHashTarget(anchorId));

  useEffect(() => {
    if (shouldRender) {
      return undefined;
    }

    function mountForHash() {
      if (isHashTarget(anchorId)) {
        setShouldRender(true);
        window.setTimeout(() => {
          document.getElementById(anchorId)?.scrollIntoView({ block: "start" });
        }, 0);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener("hashchange", mountForHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", mountForHash);
    };
  }, [anchorId, rootMargin, shouldRender]);

  return (
    <div id={anchorId} ref={containerRef}>
      {shouldRender ? (
        <Suspense fallback={<LoadingSpinner label={fallbackLabel} />}>
          {children}
        </Suspense>
      ) : (
        <div className="min-h-40" aria-hidden="true" />
      )}
    </div>
  );
}
