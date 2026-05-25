import { useEffect } from "react";
import { trackPageVisit } from "../services/api.js";

export function usePageAnalytics(path) {
  useEffect(() => {
    let isCurrent = true;

    async function sendVisit() {
      try {
        await trackPageVisit({
          path,
          referrer: document.referrer,
        });
      } catch {
        if (isCurrent && import.meta.env.DEV) {
          console.info("Page analytics request skipped.");
        }
      }
    }

    sendVisit();

    return () => {
      isCurrent = false;
    };
  }, [path]);
}
