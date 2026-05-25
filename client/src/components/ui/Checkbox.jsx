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
      <label className="flex gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-4 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#3F6212]/10" htmlFor={fieldId}>
        <input
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          checked={checked}
          className="mt-1 h-4 w-4 accent-[#3F6212]"
          disabled={disabled}
          id={fieldId}
          onChange={onChange}
          type="checkbox"
          {...props}
        />
        <span>
          <span className="block text-sm font-bold text-[#1C1917]">{label}</span>
          {description ? <span className="mt-1 block text-sm leading-6 text-[#78716C]" id={descriptionId}>{description}</span> : null}
        </span>
      </label>
      {error ? <p className="text-sm font-semibold text-[#DC2626]" id={errorId} role="alert">{error}</p> : null}
    </div>
  );
}
