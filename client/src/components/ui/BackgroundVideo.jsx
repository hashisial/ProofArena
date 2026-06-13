import { useReducedMotion } from "framer-motion";
import { cn } from "../../utils/cn.js";

export function BackgroundVideo({
  children,
  className = "",
  fallbackClassName = "",
  overlayClassName = "",
  poster,
  src,
  videoClassName = "",
}) {
  const reduceMotion = useReducedMotion();
  const shouldRenderVideo = Boolean(src) && !reduceMotion;

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-[var(--gradient-media-fallback)]",
          fallbackClassName,
        )}
      />
      {shouldRenderVideo ? (
        <video
          aria-hidden="true"
          autoPlay
          className={cn("absolute inset-0 h-full w-full object-cover", videoClassName)}
          loop
          muted
          playsInline
          poster={poster}
          preload="metadata"
          tabIndex={-1}
        >
          <source src={src} />
        </video>
      ) : null}
      <div aria-hidden="true" className={cn("absolute inset-0", overlayClassName)} />
      {children ? <div className="pointer-events-auto relative z-10">{children}</div> : null}
    </div>
  );
}
