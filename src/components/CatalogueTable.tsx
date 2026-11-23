import type { Product } from "../adapters/types";

interface CatalogueTableProps {
  products: Product[];
  loading: boolean;
}

export function CatalogueTable({ products, loading }: CatalogueTableProps) {
  return (
    <div className="table-scroll">
      <table className="catalogue-table">
        <caption className="sr-only">Product catalogue</caption>
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">SKU</th>
            <th scope="col">Stock</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody aria-busy={loading}>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="product-name">{product.name}</td>
              <td className="sku">{product.sku}</td>
              <td>{product.stock}</td>
              <td>
                <span className={`status status--${product.status}`}>
                  <span className="status-dot" aria-hidden="true" />
                  {product.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
