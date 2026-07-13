import { Link } from "react-router-dom";
import { useAppSelector } from "../../App/hooks";
import GridView from "../../features/productFeature/product/GridView";

const FeaturedProducts = () => {
  const { products, products_loading } = useAppSelector(
    (state) => state.product,
  );

  const featured = Array.isArray(products) ? products.slice(0, 4) : [];

  return (
    <section className="bg-white py-20 px-5 lg:px-10">
      {/* Heading */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
        <div>
          <p className="uppercase tracking-[5px] text-gray-400 font-semibold">
            Products
          </p>

          <h2 className="text-3xl md:text-5xl font-bold text-[#4b0082] mt-2">
            Buy from our collections of products
          </h2>
        </div>

        <Link
          to="/shop"
          className="px-6 py-3 rounded-full border-2 border-[#4b0082] text-[#4b0082] font-semibold hover:bg-[#4b0082] hover:text-white transition"
        >
          View All
        </Link>
      </div>

      {/* Loading */}
      {products_loading && (
        <div className="text-center py-16 text-xl font-semibold">
          Loading products...
        </div>
      )}

      {/* No Products */}
      {!products_loading && featured.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-[#4b0082]">
            No products available.
          </h3>

          <p className="mt-4 text-gray-600">
            Products will appear here after they are added.
          </p>
        </div>
      )}

      {/* Products */}
      {!products_loading && featured.length > 0 && (
        <GridView products={featured} />
      )}
    </section>
  );
};

export default FeaturedProducts;
