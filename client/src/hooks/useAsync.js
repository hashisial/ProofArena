import { useCallback, useEffect, useRef, useState } from "react";

const initialState = Object.freeze({
  data: null,
  error: null,
  isLoading: false,
});

export function useAsync(asyncFunction, options = {}) {
  const { immediate = false, initialData = null, onError, onSuccess } = options;
  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);
  const [state, setState] = useState({
    ...initialState,
    data: initialData,
  });

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
    };
  }, []);

  const execute = useCallback(
    async (...args) => {
      if (typeof asyncFunction !== "function") {
        throw new TypeError("useAsync requires an async function");
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setState((currentState) => ({
        ...currentState,
        error: null,
        isLoading: true,
      }));

      try {
        const data = await asyncFunction(...args);

        if (mountedRef.current && requestId === requestIdRef.current) {
          setState({
            data,
            error: null,
            isLoading: false,
          });
          onSuccess?.(data);
        }

        return data;
      } catch (error) {
        if (mountedRef.current && requestId === requestIdRef.current) {
          setState((currentState) => ({
            ...currentState,
            error,
            isLoading: false,
          }));
          onError?.(error);
        }

        throw error;
      }
    },
    [asyncFunction, onError, onSuccess],
  );

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setState({
      ...initialState,
      data: initialData,
    });
  }, [initialData]);

  useEffect(() => {
    if (immediate) {
      execute().catch(() => {});
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
  };
}
