import { ROUTES } from "../../constants/index.js";
import { UniversalBackButton } from "../ui/UniversalBackButton.jsx";

export function BackButton({
  className = "",
  fallbackPath = ROUTES.DASHBOARD,
  iconOnly = false,
  label = "Back",
  variant = "default",
}) {
  return (
    <UniversalBackButton
      className={className}
      fallbackHref={fallbackPath}
      iconOnly={iconOnly}
      label={label}
      variant={variant === "default" ? "button" : variant}
    />
  );
}
