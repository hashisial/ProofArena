import { AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn.js";
import { Button } from "./Button.jsx";

const sizes = {
  full: "h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-none",
  lg: "max-w-3xl",
  md: "max-w-xl",
  sm: "max-w-md",
  xl: "max-w-5xl",
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function Modal({
  children,
  className = "",
  closeOnEscape = true,
  closeOnOverlayClick = true,
  description,
  footer,
  isOpen,
  onClose,
  showCloseButton = true,
  size = "md",
  title,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    previousFocusRef.current = document.activeElement;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => panelRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape" && closeOnEscape) {
        onClose?.();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const panel = panelRef.current;
      const focusableElements = Array.from(panel?.querySelectorAll(focusableSelector) ?? []);

      if (!panel || focusableElements.length === 0) {
        event.preventDefault();
        panel?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEscape, isOpen, onClose]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)] px-3 py-4 sm:px-4 sm:py-6"
          onMouseDown={(event) => {
            if (closeOnOverlayClick && event.target === event.currentTarget) {
              onClose?.();
            }
          }}
        >
          <div
            aria-describedby={description ? descriptionId : undefined}
            aria-labelledby={title ? titleId : undefined}
            aria-modal="true"
            className={cn(
              "max-h-[calc(100vh-2rem)] w-full min-w-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-elevated)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-ring)]",
              sizes[size] ?? sizes.md,
              className,
            )}
            ref={panelRef}
            role="dialog"
            tabIndex={-1}
          >
            {(title || description || showCloseButton) ? (
              <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-4 py-4 sm:gap-5 sm:px-6 sm:py-5">
                <div className="min-w-0">
                  {title ? <h2 className="text-2xl font-black tracking-normal text-[var(--color-foreground)]" id={titleId}>{title}</h2> : null}
                  {description ? <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]" id={descriptionId}>{description}</p> : null}
                </div>
                {showCloseButton ? (
                  <Button aria-label="Close modal" onClick={onClose} type="button" variant="secondary">
                    <X aria-hidden="true" className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            ) : null}
            <div className="max-h-[calc(100vh-13rem)] overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">{children}</div>
            {footer ? <div className="flex flex-col-reverse gap-3 border-t border-[var(--color-border)] px-4 py-4 sm:flex-row sm:flex-wrap sm:justify-end sm:px-6 sm:py-5">{footer}</div> : null}
          </div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
