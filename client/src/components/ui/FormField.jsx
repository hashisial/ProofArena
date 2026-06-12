import { useId } from "react";

export function FormField({
  children,
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
    <div className="grid gap-2">
      {label ? (
        <label className="text-sm font-bold text-[#1C1917]" htmlFor={fieldId}>
          {label}
          {required ? <span aria-hidden="true" className="text-[#3F6212]"> *</span> : null}
        </label>
      ) : null}
      {children({ describedBy, fieldId, hasError: Boolean(error) })}
      {helperText && !error ? (
        <p className="text-sm leading-6 text-[#78716C]" id={helperId}>
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm font-semibold leading-6 text-[#DC2626]" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
