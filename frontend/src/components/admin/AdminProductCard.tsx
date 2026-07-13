import { Pencil, Trash2, Star, Eye } from "lucide-react";

import { SingleProductType } from "../../types/product";
import { priceFormat } from "../../utils/constants";
import ImageWithSkeleton from "../global_components/ImageWithSkeleton";

interface Props {
  product: SingleProductType;
}

const AdminProductCard = ({ product }: Props) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition">
      {/* Image */}

      <div className="relative h-64">
        <ImageWithSkeleton
          src={product.images?.[0]}
          alt={product.productName}
          customStyle="w-full h-full object-cover"
        />

        {product.featured && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-purple-950 px-3 py-1 rounded-full flex items-center gap-2 font-bold">
            <Star size={15} fill="currentColor" />
            Featured
          </div>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-xl font-black text-purple-950 line-clamp-2">
          {product.productName}
        </h2>

        <p className="text-sm text-gray-500 mt-2 capitalize">
          {product.category}
        </p>

        <div className="mt-4 text-3xl font-black text-yellow-600">
          {priceFormat(product.price)}
        </div>

        <div className="mt-6 flex gap-3">
          <button className="flex-1 bg-purple-900 hover:bg-purple-800 text-white py-3 rounded-xl flex justify-center items-center gap-2 transition">
            <Eye size={18} />
            View
          </button>

          <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl flex justify-center items-center gap-2 transition">
            <Pencil size={18} />
            Edit
          </button>

          <button className="bg-red-600 hover:bg-red-500 text-white px-4 rounded-xl transition">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
