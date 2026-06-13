import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

const DEFAULT_STALE_TIME_MS = 60_000;
const DEFAULT_GC_TIME_MS = 5 * 60_000;
let serverStateErrorReporter = null;

function reportServerStateError(error, metadata) {
  serverStateErrorReporter?.(error, metadata);
}

export function setServerStateErrorReporter(reporter) {
  serverStateErrorReporter = typeof reporter === "function" ? reporter : null;
}

export function shouldRetryQuery(failureCount, error) {
  if (failureCount >= 1) {
    return false;
  }

  const status = error?.statusCode ?? error?.status;

  if (!status) {
    return true;
  }

  return status === 408 || status === 429 || status >= 500;
}

export const QUERY_CLIENT_DEFAULTS = Object.freeze({
  gcTime: DEFAULT_GC_TIME_MS,
  refetchOnWindowFocus: false,
  retry: shouldRetryQuery,
  staleTime: DEFAULT_STALE_TIME_MS,
});

export function createQueryClient() {
  return new QueryClient({
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        reportServerStateError(error, {
          mutationKey: mutation.options.mutationKey,
          type: "mutation",
        });
      },
    }),
    queryCache: new QueryCache({
      onError: (error, query) => {
        reportServerStateError(error, {
          queryKey: query.queryKey,
          type: "query",
        });
      },
    }),
    defaultOptions: {
      queries: QUERY_CLIENT_DEFAULTS,
      mutations: {
        retry: 0,
      },
    },
  });
}

export const queryClient = createQueryClient();
