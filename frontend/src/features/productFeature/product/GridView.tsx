import { SingleProductType } from "../../../types/product";
import Product from "./Product";

const GridView = ({
  products,
  customStyle,
  productStyle,
}: {
  products: SingleProductType[];
  customStyle?: string;
  productStyle?: string;
}) => {
  return (
    <div
      className={
        customStyle ??
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
      }
    >
      {products.map((product) => (
        <Product key={product._id} {...product} customStyle={productStyle} />
      ))}
    </div>
  );
};

export default GridView;
