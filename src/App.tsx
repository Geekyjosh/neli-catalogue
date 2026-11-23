import { useMemo, useState } from "react";
import { CatalogueTable } from "./components/CatalogueTable";
import { CatalogueToolbar } from "./components/CatalogueToolbar";
import { createFixtureAdapter, type DemoScenario } from "./adapters/fixtureAdapter";
import type { CatalogueQuery, CatalogueStatus } from "./adapters/types";
import { useCatalogue } from "./hooks/useCatalogue";
import "./App.css";

const PAGE_SIZE = 5;

function App() {
  const [scenario, setScenario] = useState<DemoScenario>("normal");
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState<CatalogueQuery>({
    search: "",
    status: "all",
    page: 1,
    pageSize: PAGE_SIZE,
  });

  const fetchPage = useMemo(() => createFixtureAdapter(scenario), [scenario]);
  const { data, loading, error, retry } = useCatalogue(fetchPage, query);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = total === 0 ? 0 : (query.page - 1) * PAGE_SIZE + 1;
  const end = Math.min(query.page * PAGE_SIZE, total);

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
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Neli catalogue home">
          <span className="brand-mark">N</span>
          <span>neli<span className="brand-light">commerce</span></span>
        </a>
        <div className="topbar-right">
          <span className="environment-label"><span /> Demo environment</span>
          <button className="avatar" type="button" aria-label="User account">JD</button>
        </div>
      </header>

      <div className="content">
        <div className="breadcrumbs"><span>Workspace</span><span aria-hidden="true">/</span><strong>Products</strong></div>
        <section className="page-heading">
          <div>
            <p className="eyebrow">CATALOGUE MANAGEMENT</p>
            <h1>Products</h1>
            <p className="subtitle">Manage and keep track of your product catalogue.</p>
          </div>
          <label className="scenario-control">
            <span>Demo scenario</span>
            <select
              value={scenario}
              onChange={(event) => {
                setScenario(event.target.value as DemoScenario);
                setQuery((current) => ({ ...current, page: 1 }));
              }}
            >
              <option value="normal">Normal response</option>
              <option value="failure">Failure and retry</option>
              <option value="race">Race condition</option>
              <option value="empty">Empty results</option>
            </select>
          </label>
        </section>

        <section className="catalogue-card" aria-label="Products catalogue">
          <div className="card-heading">
            <div>
              <h2>All products</h2>
              <p>Browse, search and filter your inventory.</p>
            </div>
            <span className="count-pill">{total} products</span>
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
                  <p>{error} {data ? "Your previous results are still shown." : "No previous results are available yet."}</p>
                </div>
                <button type="button" onClick={retry}>Try again</button>
              </div>
            )}

            {!loading && !error && total === 0 ? (
              <div className="empty-state">
                <span className="empty-icon" aria-hidden="true">⌕</span>
                <h3>No products found</h3>
                <p>Try changing your search or status filter.</p>
                <button type="button" onClick={() => { updateSearch(""); updateStatus("all"); }}>
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <CatalogueTable products={data?.items ?? []} loading={loading} />
                <footer className="table-footer">
                  <p>Showing <strong>{start}–{end}</strong> of <strong>{total}</strong> products</p>
                  <nav className="pagination" aria-label="Catalogue pagination">
                    <button type="button" onClick={() => changePage(query.page - 1)} disabled={query.page <= 1 || loading} aria-label="Previous page">←</button>
                    <span>Page <strong>{query.page}</strong> of <strong>{totalPages}</strong></span>
                    <button type="button" onClick={() => changePage(query.page + 1)} disabled={query.page >= totalPages || loading} aria-label="Next page">→</button>
                  </nav>
                </footer>
              </>
            )}
          </div>
        </section>
        <p className="page-footnote">Catalogue data is provided by the local assessment fixture.</p>
      </div>
    </main>
  );
}

export default App;
