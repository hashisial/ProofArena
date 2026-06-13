import { useId } from "react";
import { cn } from "../../utils/cn.js";

export function FormField({
  children,
  className = "",
  error,
  helperText,
  id,
  label,
  required = false,
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const helperId = helperText ? `${fieldId}-helper` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("grid gap-2", className)}>
      {label ? (
        <label className="text-sm font-bold text-[var(--color-foreground)]" htmlFor={fieldId}>
          {label}
          {required ? <span aria-hidden="true" className="text-[var(--color-primary)]"> *</span> : null}
        </label>
      ) : null}
      {children({ describedBy, fieldId, hasError: Boolean(error) })}
      {helperText && !error ? (
        <p className="text-sm leading-6 text-[var(--color-text-muted)]" id={helperId}>
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm font-semibold leading-6 text-[var(--color-danger)]" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
