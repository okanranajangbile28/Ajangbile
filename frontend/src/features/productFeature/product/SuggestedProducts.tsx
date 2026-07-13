import { Link } from "react-router-dom";

import { ArrowRight } from "lucide-react";

import { useAppSelector } from "../../../App/hooks";

import ProductGrid from "../../../components/shop/ProductGrid";

const SuggestedProducts = () => {
  const { products } = useAppSelector((state) => state.product);

  const suggested = products.slice(0, 4);

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-14">
          <div>
            <p className="uppercase tracking-[6px] text-yellow-500 font-semibold">
              Continue Shopping
            </p>

            <h2 className="text-4xl md:text-5xl font-black text-purple-950 mt-3">
              You may also like
            </h2>

            <p className="text-gray-600 mt-4 max-w-2xl">
              Explore more authentic spiritual products carefully selected to
              preserve our heritage and traditions.
            </p>
          </div>

          <Link
            to="/shop"
            className="flex items-center gap-3 bg-purple-900 hover:bg-purple-800 text-white px-8 py-4 rounded-full font-bold transition"
          >
            View All Products
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Products */}

        <ProductGrid products={suggested} />
      </div>
    </section>
  );
};

export default SuggestedProducts;
