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
          {leftIcon ? <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]">{leftIcon}</span> : null}
          <input
            aria-describedby={describedBy}
            aria-invalid={hasError ? "true" : undefined}
            className={cn(
              "min-h-12 w-full rounded-2xl border bg-white px-4 text-[#1C1917] transition placeholder:text-[#A8A29E] focus:border-[#3F6212] focus:outline-none focus:ring-4 focus:ring-[#3F6212]/10 disabled:cursor-not-allowed disabled:bg-[#FFFBEB] disabled:text-[#78716C]",
              leftIcon && "pl-11",
              (rightIcon || isPassword) && "pr-12",
              hasError ? "border-[#DC2626]" : "border-[#E7E5E4]",
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
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-[#78716C] transition hover:bg-[#F7FEE7] hover:text-[#365314] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70"
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
            <span aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#78716C]">{rightIcon}</span>
          ) : null}
        </div>
      )}
    </FormField>
  );
}
