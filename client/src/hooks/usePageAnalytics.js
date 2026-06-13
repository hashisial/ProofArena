import { useEffect } from "react";
import { clientEnv } from "../config/env.js";
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
        if (isCurrent && clientEnv.isDevelopment) {
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
