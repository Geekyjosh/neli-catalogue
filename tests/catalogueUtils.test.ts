import { describe, expect, it } from "vitest";
import catalogue from "../fixtures/catalogue.json";
import { getCataloguePage } from "../src/utils/catalogueUtils";
import type { CatalogueQuery, Product, ProductStatus } from "../src/adapters/types";

const products: Product[] = catalogue.products.map((product) => ({
  ...product,
  status: product.status as ProductStatus,
}));

const baseQuery: CatalogueQuery = { search: "", status: "all", page: 1, pageSize: 5 };

describe("getCataloguePage", () => {
  it("returns five products and the unpaginated total", () => {
    const result = getCataloguePage(products, baseQuery);
    expect(result.items).toHaveLength(5);
    expect(result.total).toBe(12);
  });

  it("searches product names and SKUs without case sensitivity", () => {
    expect(getCataloguePage(products, { ...baseQuery, search: "atlas" }).total).toBe(2);
    expect(getCataloguePage(products, { ...baseQuery, search: "fix-006" }).items[0].name).toBe("Fir Table");
  });

  it("filters by status before pagination", () => {
    const result = getCataloguePage(products, { ...baseQuery, status: "draft" });
    expect(result.total).toBe(2);
    expect(result.items.every((product) => product.status === "draft")).toBe(true);
  });

  it("sorts alphabetically and uses id as a deterministic tie-breaker", () => {
    const result = getCataloguePage(products, { ...baseQuery, pageSize: 12 });
    expect(result.items.slice(0, 2).map((product) => product.id)).toEqual(["p01", "p04"]);
  });

  it("returns an empty result for unmatched searches", () => {
    expect(getCataloguePage(products, { ...baseQuery, search: "not-a-product" })).toEqual({ items: [], total: 0 });
  });
});
