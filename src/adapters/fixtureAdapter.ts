import catalogue from "../../fixtures/catalogue.json";

import type {
  CatalogueQuery,
  FetchPage,
  Product,
  ProductStatus,
} from "./types";

import { getCataloguePage } from "../utils/catalogueUtils";

export type DemoScenario = "normal" | "failure" | "race" | "empty";

// Convert the imported JSON into our strongly typed Product array.
const products: Product[] = catalogue.products.map((product) => ({
  ...product,
  status: product.status as ProductStatus,
}));

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function createFixtureAdapter(
  scenario: DemoScenario = "normal",
): FetchPage {
  let requestCount = 0;
  let failureUsed = false;

  return async (query: CatalogueQuery) => {
    requestCount += 1;

    switch (scenario) {
      case "normal": {
        await delay(100);
        break;
      }

      case "failure": {
        if (!failureUsed) {
          failureUsed = true;
          await delay(100);

          throw new Error("Unable to load the catalogue. Please try again.");
        }

        break;
      }

      case "race": {
        const requestDelay = requestCount === 1 ? 600 : 50;
        await delay(requestDelay);
        break;
      }

      case "empty": {
        break;
      }
    }

    const effectiveQuery: CatalogueQuery =
      scenario === "empty"
        ? {
            ...query,
            search: "__no_matching_product__",
          }
        : query;

    return getCataloguePage(products, effectiveQuery);
  };
}
