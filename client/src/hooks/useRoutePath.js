import { useLocation } from "react-router-dom";

export function useRoutePath() {
  return useLocation().pathname;
}
