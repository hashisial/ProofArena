import { useId } from "react";
import { cn } from "../../utils/cn.js";

export function Checkbox({
  checked,
  className = "",
  description,
  disabled = false,
  error,
  id,
  label,
  onChange,
  ...props
}) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("grid gap-2", className)}>
      <label className="flex gap-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-card)] p-4 transition duration-[var(--motion-duration-standard)] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[var(--color-primary-ring)]" htmlFor={fieldId}>
        <input
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          checked={checked}
          className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
          disabled={disabled}
          id={fieldId}
          onChange={onChange}
          type="checkbox"
          {...props}
        />
        <span>
          <span className="block text-sm font-bold text-[var(--color-foreground)]">{label}</span>
          {description ? <span className="mt-1 block text-sm leading-6 text-[var(--color-text-muted)]" id={descriptionId}>{description}</span> : null}
        </span>
      </label>
      {error ? <p className="text-sm font-semibold text-[var(--color-danger)]" id={errorId} role="alert">{error}</p> : null}
    </div>
  );
}
