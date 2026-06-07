import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/cn.js";
import { FormField } from "./FormField.jsx";

const inputTypes = new Set(["date", "email", "month", "number", "password", "search", "tel", "text", "url"]);

export function Input({
  className = "",
  error,
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
    <FormField error={error} helperText={helperText} id={id} label={label} required={required}>
      {({ describedBy, fieldId, hasError }) => (
        <div className="relative">
          {leftIcon ? <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F657C]">{leftIcon}</span> : null}
          <input
            aria-describedby={describedBy}
            aria-invalid={hasError ? "true" : undefined}
            className={cn(
              "min-h-12 w-full rounded-2xl border bg-white px-4 text-[#07030D] transition placeholder:text-[#A69AB5] focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/10 disabled:cursor-not-allowed disabled:bg-[#F8F4FF] disabled:text-[#6F657C]",
              leftIcon && "pl-11",
              (rightIcon || isPassword) && "pr-12",
              hasError ? "border-[#DC2626]" : "border-[#E9E2F3]",
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
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-[#6F657C] transition hover:bg-[#F5F3FF] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70"
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
            <span aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6F657C]">{rightIcon}</span>
          ) : null}
        </div>
      )}
    </FormField>
  );
}
