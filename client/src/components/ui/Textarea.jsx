import { cn } from "../../utils/cn.js";
import { FormField } from "./FormField.jsx";

export function Textarea({
  className = "",
  error,
  helperText,
  id,
  label,
  required = false,
  rows = 5,
  ...props
}) {
  return (
    <FormField error={error} helperText={helperText} id={id} label={label} required={required}>
      {({ describedBy, fieldId, hasError }) => (
        <textarea
          aria-describedby={describedBy}
          aria-invalid={hasError ? "true" : undefined}
          className={cn(
            "w-full rounded-2xl border bg-white px-4 py-3 text-[#07030D] transition placeholder:text-[#A69AB5] focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/10 disabled:cursor-not-allowed disabled:bg-[#F8F4FF] disabled:text-[#6F657C]",
            hasError ? "border-[#DC2626]" : "border-[#E9E2F3]",
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
