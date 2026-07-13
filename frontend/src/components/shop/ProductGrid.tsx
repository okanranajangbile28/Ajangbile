import ProductCard from "./ProductCard";
import { SingleProductType } from "../../types/product";

interface ProductGridProps {
  products: SingleProductType[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} {...product} />
      ))}
    </div>
  );
};

export default ProductGrid;
