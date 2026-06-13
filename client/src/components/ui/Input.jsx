import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn.js";
import { FormField } from "./FormField.jsx";

const inputTypes = new Set(["date", "email", "month", "number", "password", "search", "tel", "text", "url"]);

export function Input({
  className = "",
  containerClassName = "",
  error,
  fullWidth = true,
  helperText,
  id,
  label,
  leftIcon,
  required = false,
  rightIcon,
  type = "text",
  ...props
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && passwordVisible ? "text" : type;

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
        <div className="relative">
          {leftIcon ? <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">{leftIcon}</span> : null}
          <input
            aria-describedby={describedBy}
            aria-invalid={hasError ? "true" : undefined}
            className={cn(
              "min-h-12 w-full rounded-[var(--radius-input)] border bg-[var(--color-card)] px-4 text-[var(--color-foreground)] transition duration-[var(--motion-duration-standard)] placeholder:text-[var(--color-text-light)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-[var(--color-primary-ring)] disabled:cursor-not-allowed disabled:bg-[var(--color-muted-surface)] disabled:text-[var(--color-text-muted)]",
              leftIcon && "pl-11",
              (rightIcon || isPassword) && "pr-12",
              hasError ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
              className,
            )}
            id={fieldId}
            required={required}
            type={inputTypes.has(inputType) ? inputType : "text"}
            {...props}
          />
          {isPassword ? (
            <button
              aria-label={passwordVisible ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] transition duration-[var(--motion-duration-standard)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              onClick={() => setPasswordVisible((current) => !current)}
              type="button"
            >
              {passwordVisible ? (
                <EyeOff aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Eye aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
          ) : rightIcon ? (
            <span aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">{rightIcon}</span>
          ) : null}
        </div>
      )}
    </FormField>
  );
}
