import { cn } from "../../utils/cn.js";
import { FormField } from "./FormField.jsx";

export function Select({
  className = "",
  error,
  helperText,
  id,
  label,
  options = [],
  placeholder = "Select an option",
  required = false,
  ...props
}) {
  return (
    <FormField error={error} helperText={helperText} id={id} label={label} required={required}>
      {({ describedBy, fieldId, hasError }) => (
        <select
          aria-describedby={describedBy}
          aria-invalid={hasError ? "true" : undefined}
          className={cn(
            "min-h-12 w-full rounded-[var(--radius-input)] border bg-[var(--color-card)] px-4 text-[var(--color-foreground)] transition duration-[var(--motion-duration-standard)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-ring)] disabled:cursor-not-allowed disabled:bg-[var(--color-muted-surface)] disabled:text-[var(--color-text-muted)]",
            hasError ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
            className,
          )}
          id={fieldId}
          required={required}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FormField>
  );
}
