import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCatalogue } from "../src/hooks/useCatalogue";
import type { CatalogueQuery, CatalogueResponse, FetchPage } from "../src/adapters/types";

const query: CatalogueQuery = { search: "", status: "all", page: 1, pageSize: 5 };
const response: CatalogueResponse = { items: [{ id: "1", sku: "SKU-1", name: "Desk", stock: 4, status: "active" }], total: 1 };

describe("useCatalogue", () => {
  it("loads and exposes successful results", async () => {
    const fetchPage = vi.fn<FetchPage>().mockResolvedValue(response);
    const { result } = renderHook(() => useCatalogue(fetchPage, query));
    await waitFor(() => expect(result.current.data).toEqual(response));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.dataQuery).toEqual(query);
  });

  it("keeps the last successful results when a later request fails and supports retry", async () => {
    const fetchPage = vi.fn<FetchPage>()
      .mockResolvedValueOnce(response)
      .mockRejectedValueOnce(new Error("Temporary failure"))
      .mockResolvedValueOnce({ ...response, total: 2 });

    const { result, rerender } = renderHook(
      ({ currentQuery }) => useCatalogue(fetchPage, currentQuery),
      { initialProps: { currentQuery: query } },
    );
    await waitFor(() => expect(result.current.data).toEqual(response));

    rerender({ currentQuery: { ...query, search: "desk" } });
    await waitFor(() => expect(result.current.error).toBe("Temporary failure"));
    expect(result.current.data).toEqual(response);
    expect(result.current.dataQuery).toEqual(query);

    act(() => result.current.retry());
    await waitFor(() => expect(result.current.data?.total).toBe(2));
    expect(result.current.error).toBeNull();
  });

  it("requests the new last page when the total shrinks", async () => {
    const pageThreeResponse: CatalogueResponse = { items: [], total: 7 };
    const lastPageResponse: CatalogueResponse = {
      items: [{ id: "7", sku: "SKU-7", name: "Last item", stock: 1, status: "active" }],
      total: 7,
    };
    const fetchPage = vi.fn<FetchPage>()
      .mockResolvedValueOnce(pageThreeResponse)
      .mockResolvedValueOnce(lastPageResponse);
    const pageThreeQuery = { ...query, page: 3 };

    const { result } = renderHook(() => useCatalogue(fetchPage, pageThreeQuery));

    await waitFor(() => expect(result.current.data).toEqual(lastPageResponse));
    expect(fetchPage).toHaveBeenNthCalledWith(1, pageThreeQuery);
    expect(fetchPage).toHaveBeenNthCalledWith(2, { ...pageThreeQuery, page: 2 });
    expect(result.current.dataQuery).toEqual({ ...pageThreeQuery, page: 2 });
  });

  it("normalizes an empty result to page one", async () => {
    const emptyResponse: CatalogueResponse = { items: [], total: 0 };
    const pageFourQuery = { ...query, page: 4 };
    const fetchPage = vi.fn<FetchPage>().mockResolvedValue(emptyResponse);
    const { result } = renderHook(() => useCatalogue(fetchPage, pageFourQuery));

    await waitFor(() => expect(result.current.data).toEqual(emptyResponse));
    expect(result.current.dataQuery).toEqual({ ...pageFourQuery, page: 1 });
    expect(fetchPage).toHaveBeenCalledTimes(1);
  });

  it("does not allow an older, slower response to overwrite a newer response", async () => {
    let resolveOld!: (value: CatalogueResponse) => void;
    const oldResponse = new Promise<CatalogueResponse>((resolve) => { resolveOld = resolve; });
    const fetchPage = vi.fn<FetchPage>()
      .mockReturnValueOnce(oldResponse)
      .mockResolvedValueOnce({ ...response, items: [{ ...response.items[0], name: "New result" }] });

    const { result, rerender } = renderHook(
      ({ currentQuery }) => useCatalogue(fetchPage, currentQuery),
      { initialProps: { currentQuery: query } },
    );

    rerender({ currentQuery: { ...query, search: "new" } });
    await waitFor(() => expect(result.current.data?.items[0].name).toBe("New result"));

    await act(async () => { resolveOld({ ...response, items: [{ ...response.items[0], name: "Old result" }] }); });
    expect(result.current.data?.items[0].name).toBe("New result");
  });

  it("recovers to the last page when the adapter's total shrinks between requests", async () => {
    const dataset = Array.from({ length: 12 }, (_, i) => ({ id: `s${i + 1}`, sku: `S-${i + 1}`, name: `Item ${i + 1}`, stock: i, status: "active" as const }));
    const fetchPage = vi.fn<FetchPage>((q) => {
      const start = (q.page - 1) * q.pageSize;
      return Promise.resolve({ items: dataset.slice(start, start + q.pageSize), total: dataset.length });
    });
    const pageThree = { ...query, page: 3 };

    const { result } = renderHook(() => useCatalogue(fetchPage, pageThree));
    await waitFor(() => expect(result.current.data?.items).toHaveLength(2));
    expect(result.current.dataQuery?.page).toBe(3);

    dataset.splice(7);
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.dataQuery?.page).toBe(2));
    expect(result.current.data?.total).toBe(7);
    expect(result.current.data?.items.map((item) => item.id)).toEqual(["s6", "s7"]);
    expect(fetchPage).toHaveBeenCalledTimes(3);
    expect(fetchPage).toHaveBeenNthCalledWith(3, { ...pageThree, page: 2 });
  });

  it("does not show an error from an older request that fails after a newer one succeeded", async () => {
    let rejectOld!: (reason: Error) => void;
    const oldRequest = new Promise<CatalogueResponse>((_, reject) => { rejectOld = reject; });
    const fetchPage = vi.fn<FetchPage>()
      .mockReturnValueOnce(oldRequest)
      .mockResolvedValueOnce(response);

    const { result, rerender } = renderHook(
      ({ currentQuery }) => useCatalogue(fetchPage, currentQuery),
      { initialProps: { currentQuery: query } },
    );
    rerender({ currentQuery: { ...query, search: "new" } });
    await waitFor(() => expect(result.current.data).toEqual(response));

    await act(async () => { rejectOld(new Error("Old failure")); });
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(response);
  });
});
