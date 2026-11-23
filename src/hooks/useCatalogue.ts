import { useCallback, useEffect, useRef, useState } from "react";
import type { CatalogueQuery, CatalogueResponse, FetchPage } from "../adapters/types";

interface SuccessfulResult {
  response: CatalogueResponse;
  query: CatalogueQuery;
}

interface CatalogueState {
  successful: SuccessfulResult | null;
  loading: boolean;
  error: string | null;
}

function copyQuery(query: CatalogueQuery): CatalogueQuery {
  return { ...query };
}

export function useCatalogue(fetchPage: FetchPage, query: CatalogueQuery) {
  const [state, setState] = useState<CatalogueState>({
    successful: null,
    loading: true,
    error: null,
  });
  const [retryKey, setRetryKey] = useState(0);
  const latestRequest = useRef(0);

  useEffect(() => {
    const requestId = ++latestRequest.current;
    let active = true;
    const requestedQuery = copyQuery(query);

    // A new query withdraws any previous error/retry action but keeps the
    // last successful response visible until this request succeeds.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((current) => ({ ...current, loading: true, error: null }));

    async function load() {
      try {
        let response = await fetchPage(requestedQuery);
        let resolvedQuery = requestedQuery;

        // If the result set shrank while the user was on a later page,
        // make exactly one request for the new last page.
        if (response.total > 0) {
          const lastPage = Math.ceil(response.total / requestedQuery.pageSize);
          if (requestedQuery.page > lastPage) {
            resolvedQuery = { ...requestedQuery, page: lastPage };
            response = await fetchPage(resolvedQuery);
          }
        }

        if (!active || requestId !== latestRequest.current) return;
        setState({
          successful: { response, query: resolvedQuery },
          loading: false,
          error: null,
        });
      } catch (error: unknown) {
        if (!active || requestId !== latestRequest.current) return;
        setState((current) => ({
          ...current,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Something went wrong while loading the catalogue.",
        }));
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [fetchPage, query.search, query.status, query.page, query.pageSize, retryKey]);

  const retry = useCallback(() => {
    setRetryKey((current) => current + 1);
  }, []);

  return {
    data: state.successful?.response ?? null,
    dataQuery: state.successful?.query ?? null,
    loading: state.loading,
    error: state.error,
    retry,
  };
}
