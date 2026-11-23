import type {
  CatalogueQuery,
  CatalogueResponse,
  Product,
} from "../adapters/types";

export function getCataloguePage(
  products: Product[],
  query: CatalogueQuery,
): CatalogueResponse {
  const searchTerm = query.search.trim().toLocaleLowerCase("en");

  // 1. Filter by search and status.
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLocaleLowerCase("en").includes(searchTerm) ||
      product.sku.toLocaleLowerCase("en").includes(searchTerm);

    const matchesStatus =
      query.status === "all" || product.status === query.status;

    return matchesSearch && matchesStatus;
  });

  // 2. Sort by English alphabetical order.
  // Product IDs break ties to guarantee stable ordering.
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const nameComparison = a.name.localeCompare(b.name, "en", {
      sensitivity: "base",
    });

    if (nameComparison !== 0) {
      return nameComparison;
    }

    return a.id.localeCompare(b.id, "en");
  });

  // 3. Calculate total before pagination.
  const total = sortedProducts.length;

  // 4. Empty results always use page 1.
  if (total === 0) {
    return {
      items: [],
      total: 0,
    };
  }

  // 5. Return the requested page.
  const startIndex = (query.page - 1) * query.pageSize;

  return {
    items: sortedProducts.slice(startIndex, startIndex + query.pageSize),
    total,
  };
}
