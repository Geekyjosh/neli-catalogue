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

  it("searches product names and SKUs without case sensitivity or surrounding spaces", () => {
    expect(getCataloguePage(products, { ...baseQuery, search: "  atlas  " }).total).toBe(2);
    expect(getCataloguePage(products, { ...baseQuery, search: "fix-006" }).items[0].name).toBe("Fir Table");
  });

  it("intersects search and status filters before pagination", () => {
    const result = getCataloguePage(products, {
      ...baseQuery,
      search: "atlas",
      status: "active",
    });
    expect(result.items.map((product) => product.id)).toEqual(["p01", "p04"]);
    expect(result.total).toBe(2);
    expect(getCataloguePage(products, { ...baseQuery, search: "atlas", status: "draft" })).toEqual({ items: [], total: 0 });
  });

  it("returns the second page and a short last page with the full total", () => {
    const second = getCataloguePage(products, { ...baseQuery, page: 2 });
    expect(second.total).toBe(12);
    expect(second.items).toHaveLength(5);
    const last = getCataloguePage(products, { ...baseQuery, page: 3 });
    expect(last.items).toHaveLength(2);
    expect(getCataloguePage(products, { ...baseQuery, page: 9 })).toEqual({ items: [], total: 12 });
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

  it("sorts duplicate names by id even when different input IDs arrive in reverse order", () => {
    const duplicateNameProducts: Product[] = [
      { id: "z-900", sku: "SKU-Z", name: "Same name", stock: 1, status: "active" },
      { id: "a-100", sku: "SKU-A", name: "Same name", stock: 2, status: "active" },
      { id: "m-500", sku: "SKU-M", name: "Same name", stock: 3, status: "active" },
    ];
    const result = getCataloguePage(duplicateNameProducts, { ...baseQuery, pageSize: 5 });
    expect(result.items.map((product) => product.id)).toEqual(["a-100", "m-500", "z-900"]);
  });

  it("returns an empty result for unmatched searches", () => {
    expect(getCataloguePage(products, { ...baseQuery, search: "not-a-product" })).toEqual({ items: [], total: 0 });
  });
});
