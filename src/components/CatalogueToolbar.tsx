import type { CatalogueStatus } from "../adapters/types";

interface CatalogueToolbarProps {
  search: string;
  status: CatalogueStatus;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CatalogueStatus) => void;
}

const filters: { label: string; value: CatalogueStatus }[] = [
  { label: "All products", value: "all" },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

export function CatalogueToolbar({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: CatalogueToolbarProps) {
  return (
    <section className="toolbar" aria-label="Catalogue controls">
      <label className="search-field">
        <span className="sr-only">Search products by name or SKU</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 4 4" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by product name or SKU"
        />
      </label>
      <div className="filter-list" role="group" aria-label="Filter by status">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={status === filter.value ? "filter-button is-active" : "filter-button"}
            aria-pressed={status === filter.value}
            onClick={() => onStatusChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </section>
  );
}
