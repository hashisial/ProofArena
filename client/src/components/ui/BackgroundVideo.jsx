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
          "absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(63, 98, 18, 0.2),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(243,232,255,0.72))]",
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
