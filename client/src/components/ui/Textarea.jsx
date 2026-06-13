import { cn } from "../../utils/cn.js";
import { FormField } from "./FormField.jsx";

export function Textarea({
  className = "",
  containerClassName = "",
  error,
  fullWidth = true,
  helperText,
  id,
  label,
  required = false,
  rows = 5,
  ...props
}) {
  return (
    <FormField
      className={cn(fullWidth ? "w-full" : "w-fit", containerClassName)}
      error={error}
      helperText={helperText}
      id={id}
      label={label}
      required={required}
    >
      {({ describedBy, fieldId, hasError }) => (
        <textarea
          aria-describedby={describedBy}
          aria-invalid={hasError ? "true" : undefined}
          className={cn(
            "w-full rounded-[var(--radius-input)] border bg-[var(--color-card)] px-4 py-3 text-[var(--color-foreground)] transition duration-[var(--motion-duration-standard)] placeholder:text-[var(--color-text-light)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-ring)] disabled:cursor-not-allowed disabled:bg-[var(--color-muted-surface)] disabled:text-[var(--color-text-muted)]",
            hasError ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
            className,
          )}
          id={fieldId}
          required={required}
          rows={rows}
          {...props}
        />
      )}
    </FormField>
  );
}
