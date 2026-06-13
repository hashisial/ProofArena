import { APP_BRAND, ROUTES } from "../constants/index.js";
import { cn } from "../utils/cn.js";

export function BrandLogo({ className = "", markClassName = "", onClick, size = "md" }) {
  const markSize = size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const nameSize = size === "lg" ? "text-2xl" : "text-lg";

  return (
    <a
      aria-label={`${APP_BRAND.PRODUCT_NAME} home`}
      className={cn(
        "group flex min-w-0 items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
        className,
      )}
      href={ROUTES.HOME}
      onClick={onClick}
    >
      <img
        alt=""
        aria-hidden="true"
        className={cn(
          markSize,
          "shrink-0 transition duration-200 group-hover:-translate-y-0.5",
          markClassName,
        )}
        src="/proofarena-mark.svg"
      />
      <span className="min-w-0">
        <span className={cn("block truncate font-black leading-none text-[var(--color-foreground)]", nameSize)}>
          {APP_BRAND.PRODUCT_NAME}
        </span>
        <span className="mt-1 hidden text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--color-text-muted)] sm:block">
          by {APP_BRAND.COMPANY_NAME}
        </span>
      </span>
    </a>
  );
}
