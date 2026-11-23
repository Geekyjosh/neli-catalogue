import { useCallback, useEffect, useRef, useState } from "react";
import type { CatalogueQuery, CatalogueResponse, FetchPage } from "../adapters/types";

interface CatalogueState {
  data: CatalogueResponse | null;
  loading: boolean;
  error: string | null;
}

export function useCatalogue(fetchPage: FetchPage, query: CatalogueQuery) {
  const [state, setState] = useState<CatalogueState>({
    data: null,
    loading: true,
    error: null,
  });
  const [retryKey, setRetryKey] = useState(0);
  const latestRequest = useRef(0);

  useEffect(() => {
    const requestId = ++latestRequest.current;
    let active = true;

    setState((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    fetchPage(query)
      .then((data) => {
        if (!active || requestId !== latestRequest.current) return;
        setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!active || requestId !== latestRequest.current) return;
        setState((current) => ({
          ...current,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Something went wrong while loading the catalogue.",
        }));
      });

    return () => {
      active = false;
    };
  }, [fetchPage, query.search, query.status, query.page, query.pageSize, retryKey]);

  const retry = useCallback(() => {
    setRetryKey((current) => current + 1);
  }, []);

  return { ...state, retry };
}
