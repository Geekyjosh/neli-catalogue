import { useState } from "react";
import type { CatalogueQuery, CatalogueStatus, FetchPage } from "../adapters/types";
import { useCatalogue } from "../hooks/useCatalogue";
import { CatalogueTable } from "./CatalogueTable";
import { CatalogueToolbar } from "./CatalogueToolbar";

export interface CatalogueProps {
  /** Promise-based data source. The demo injects its local fixture adapter. */
  fetchPage: FetchPage;
  /** Number of products per page. Defaults to five. */
  pageSize?: number;
}

/**
 * Reusable catalogue view. It owns search, status and page state while the
 * injected adapter owns data retrieval. It has no dependency on demo scenarios
 * or fixture identifiers.
 */
export function Catalogue({ fetchPage, pageSize = 5 }: CatalogueProps) {
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState<CatalogueQuery>({
    search: "",
    status: "all",
    page: 1,
    pageSize,
  });

  const { data, dataQuery, loading, error, retry } = useCatalogue(fetchPage, query);
  const displayedQuery = dataQuery ?? query;
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (displayedQuery.page - 1) * pageSize + 1;
  const end = Math.min(displayedQuery.page * pageSize, total);
  const hasPreviousResults = Boolean(error && data);

  function updateSearch(value: string) {
    setSearchInput(value);
    setQuery((current) => ({ ...current, search: value, page: 1 }));
  }

  function updateStatus(value: CatalogueStatus) {
    setQuery((current) => ({ ...current, status: value, page: 1 }));
  }

  function changePage(page: number) {
    setQuery((current) => ({ ...current, page }));
  }

  return (
    <section className="catalogue-card" aria-label="Products catalogue">
      <div className="card-heading">
        <div>
          <h2>All products</h2>
          <p>Browse, search and filter your inventory.</p>
        </div>
        <span className="count-pill" aria-live="polite">{data ? `${total} products` : "Products"}</span>
      </div>

      <CatalogueToolbar
        search={searchInput}
        status={query.status}
        onSearchChange={updateSearch}
        onStatusChange={updateStatus}
      />

      <div className="results-area">
        {loading && (
          <div className="loading-message" role="status">
            <span className="spinner" aria-hidden="true" />
            Updating catalogue…
          </div>
        )}

        {error && (
          <div className="error-banner" role="alert">
            <div>
              <strong>We couldn't load the latest results</strong>
              <p>{error} {data ? "The previous successful results are shown below." : "No previous results are available yet."}</p>
            </div>
            <button type="button" onClick={retry}>Try again</button>
          </div>
        )}

        {!loading && !error && data?.total === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">⌕</span>
            <h3>No products found</h3>
            <p>Try changing your search or status filter.</p>
            <button type="button" onClick={() => { updateSearch(""); updateStatus("all"); }}>
              Clear filters
            </button>
          </div>
        ) : data ? (
          <>
            {hasPreviousResults && <p className="previous-results-label">Showing previous successful results</p>}
            <CatalogueTable products={data.items} loading={loading} />
            <footer className="table-footer">
              <p>Showing <strong>{start}–{end}</strong> of <strong>{total}</strong> products</p>
              <nav className="pagination" aria-label="Catalogue pagination">
                <button type="button" onClick={() => changePage(displayedQuery.page - 1)} disabled={displayedQuery.page <= 1 || loading || Boolean(error)} aria-label="Previous page">←</button>
                <span>Page <strong>{displayedQuery.page}</strong> of <strong>{totalPages}</strong></span>
                <button type="button" onClick={() => changePage(displayedQuery.page + 1)} disabled={displayedQuery.page >= totalPages || loading || Boolean(error)} aria-label="Next page">→</button>
              </nav>
            </footer>
          </>
        ) : null}
      </div>
    </section>
  );
}
