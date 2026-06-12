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
            "w-full rounded-2xl border bg-white px-4 py-3 text-[#1C1917] transition placeholder:text-[#A8A29E] focus:border-[#3F6212] focus:outline-none focus:ring-4 focus:ring-[#3F6212]/10 disabled:cursor-not-allowed disabled:bg-[#FFFBEB] disabled:text-[#78716C]",
            hasError ? "border-[#DC2626]" : "border-[#E7E5E4]",
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
