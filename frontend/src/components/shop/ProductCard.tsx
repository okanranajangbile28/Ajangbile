import { Link } from "react-router-dom";
import { Eye, ShoppingBag } from "lucide-react";
import { priceFormat } from "../../utils/constants";
import ImageWithSkeleton from "../global_components/ImageWithSkeleton";
import { SingleProductType } from "../../types/product";

const ProductCard = ({
  _id,
  productName,
  description,
  price,
  images,
  category,
  totalQuantity,
  unit,
  featured,
}: SingleProductType) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square">
        <ImageWithSkeleton
          src={images?.[0]}
          alt={productName}
          customStyle="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
          <Link
            to={`/shop/${_id}`}
            className="flex items-center gap-2 bg-white text-purple-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition"
          >
            <Eye size={18} />
            View Product
          </Link>
        </div>

        {/* Category */}
        <div className="absolute top-4 left-4 bg-purple-900 text-white text-xs uppercase px-3 py-1 rounded-full">
          {category}
        </div>

        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-purple-950 text-xs font-bold px-3 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-6 flex flex-col gap-3">
        <h2 className="text-xl font-bold text-purple-950 line-clamp-2 min-h-[58px]">
          {productName}
        </h2>

        <p className="text-gray-500 text-sm line-clamp-2 min-h-[42px]">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-extrabold text-yellow-600">
            {priceFormat(price)}
          </span>

          <span className="text-sm text-gray-500">
            {totalQuantity} {unit}
          </span>
        </div>

        <Link
          to={`/shop/${_id}`}
          className="mt-2 flex items-center justify-center gap-2 bg-purple-900 hover:bg-yellow-500 hover:text-purple-950 text-white py-3 rounded-xl font-semibold transition"
        >
          <ShoppingBag size={18} />
          View Product
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
