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
            "min-h-12 w-full rounded-2xl border bg-white px-4 text-[#07030D] transition focus:border-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/10 disabled:cursor-not-allowed disabled:bg-[#F8F4FF] disabled:text-[#6F657C]",
            hasError ? "border-[#DC2626]" : "border-[#E9E2F3]",
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
