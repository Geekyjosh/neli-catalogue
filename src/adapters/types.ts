export type ProductStatus = "active" | "draft" | "archived";

export type CatalogueStatus = "all" | ProductStatus;

export interface Product {
  id: string;
  sku: string;
  name: string;
  stock: number;
  status: ProductStatus;
}

export interface CatalogueQuery {
  search: string;
  status: CatalogueStatus;
  page: number;
  pageSize: number;
}

export interface CatalogueResponse {
  items: Product[];
  total: number;
}

export type FetchPage = (query: CatalogueQuery) => Promise<CatalogueResponse>;
