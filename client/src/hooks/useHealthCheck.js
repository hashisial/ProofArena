import { useEffect, useState } from "react";
import { getHealthStatus } from "../services/api.js";

export function useHealthCheck() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHealthStatus() {
      try {
        const healthStatus = await getHealthStatus();

        if (isMounted) {
          setData(healthStatus);
          setError("");
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadHealthStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, error, isLoading };
}
