import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Catalogue } from "../src/components/Catalogue";
import type { CatalogueQuery, CatalogueResponse, FetchPage, Product } from "../src/adapters/types";

function makeProducts(prefix: string, count: number): Product[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    sku: `${prefix.toUpperCase()}-${index + 1}`,
    name: `${prefix} product ${index + 1}`,
    stock: index + 1,
    status: index % 2 === 0 ? "active" : "draft",
  }));
}

function pageFor(query: CatalogueQuery, allProducts: Product[]): CatalogueResponse {
  const filtered = allProducts.filter((product) => {
    const search = query.search.trim().toLowerCase();
    const matchesSearch = !search || product.name.toLowerCase().includes(search) || product.sku.toLowerCase().includes(search);
    const matchesStatus = query.status === "all" || product.status === query.status;
    return matchesSearch && matchesStatus;
  });
  const start = (query.page - 1) * query.pageSize;
  return { items: filtered.slice(start, start + query.pageSize), total: filtered.length };
}

describe("Catalogue component", () => {
  it("resets to page one when search or status changes and exposes labelled controls", async () => {
    const user = userEvent.setup();
    const allProducts = [...makeProducts("desk", 12), ...makeProducts("lamp", 4)];
    const fetchPage = vi.fn<FetchPage>((query) => Promise.resolve(pageFor(query, allProducts)));

    render(<Catalogue fetchPage={fetchPage} />);
    await screen.findByText("desk product 1");
    await user.click(screen.getByRole("button", { name: "Next page" }));
    await screen.findByText("desk product 6");

    fireEvent.change(screen.getByRole("searchbox", { name: "Search products by name or SKU" }), { target: { value: "lamp" } });
    await screen.findByText("lamp product 1");
    expect(screen.getByRole("navigation", { name: "Catalogue pagination" })).toHaveTextContent("Page 1 of 1");
    expect(fetchPage).toHaveBeenLastCalledWith(expect.objectContaining({ search: "lamp", page: 1 }));

    await user.click(screen.getByRole("button", { name: "Active" }));
    await waitFor(() => expect(fetchPage).toHaveBeenLastCalledWith(expect.objectContaining({ search: "lamp", status: "active", page: 1 })));
  });

  it("labels retained rows after failure, preserves their count/page and disables pagination until retry succeeds", async () => {
    const user = userEvent.setup();
    const allProducts = makeProducts("desk", 12);
    const fetchPage = vi.fn<FetchPage>()
      .mockImplementationOnce((query) => Promise.resolve(pageFor(query, allProducts)))
      .mockRejectedValueOnce(new Error("Temporary network error"))
      .mockImplementationOnce((query) => Promise.resolve(pageFor(query, allProducts)));

    render(<Catalogue fetchPage={fetchPage} />);
    await screen.findByText("desk product 1");
    fireEvent.change(screen.getByRole("searchbox", { name: "Search products by name or SKU" }), { target: { value: "product 2" } });

    expect(await screen.findByRole("alert")).toHaveTextContent("Temporary network error");
    expect(screen.getByText("Showing previous successful results")).toBeInTheDocument();
    expect(
      screen.getByText((_, element) =>
        element?.tagName === "P" &&
        element.textContent?.replace(/\\s+/g, " ").trim() === "Showing 1–5 of 12 products",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Try again" }));
    await screen.findByText("desk product 2");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
