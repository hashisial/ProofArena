import { Check, Scale } from "lucide-react";
import { useToast } from "../../hooks/useToast.js";
import {
  getProviderCompareId,
  useProviderComparisonState,
} from "../../features/providers/providerComparisonState.js";
import { Button } from "../ui/Button.jsx";

export function ProviderCompareButton({
  className = "",
  label = "Compare",
  provider = {},
  selectedLabel = "Selected",
  variant = "outline",
}) {
  const { isLimitReached, isSelected, maxProviders, toggleProvider } = useProviderComparisonState();
  const { showToast } = useToast();
  const providerId = getProviderCompareId(provider);
  const selected = isSelected(providerId);
  const disabled = !providerId;
  const buttonLabel = selected ? selectedLabel : isLimitReached ? `Max ${maxProviders} selected` : label;

  function handleToggle() {
    const result = toggleProvider(provider);

    if (!result.ok && result.message) {
      showToast({
        message: result.message,
        type: "error",
      });
    }
  }

  return (
    <Button
      aria-label={selected ? "Remove provider from comparison" : "Add provider to comparison"}
      aria-pressed={selected}
      className={className}
      disabled={disabled}
      onClick={handleToggle}
      type="button"
      variant={selected ? "secondary" : variant}
    >
      {selected ? (
        <Check aria-hidden="true" className="mr-2 h-4 w-4" />
      ) : (
        <Scale aria-hidden="true" className="mr-2 h-4 w-4" />
      )}
      {buttonLabel}
    </Button>
  );
}
