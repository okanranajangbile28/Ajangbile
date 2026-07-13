import { Pencil, Trash2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../App/hooks";
import { deleteProduct } from "../../features/productFeature/productSlice";

import { SingleProductType } from "../../types/product";
import { priceFormat } from "../../utils/constants";

import ImageWithSkeleton from "../global_components/ImageWithSkeleton";

interface Props {
  products: SingleProductType[];
}

const AdminProductGrid = ({ products }: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleDelete = async (id: string | undefined, name: string) => {
    if (!id) {
      alert("Product ID not found.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${name}"?`,
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteProduct(id)).unwrap();
      alert("Product deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to delete product.");
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <div
          key={product._id ?? product.productName}
          className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition duration-300 hover:shadow-2xl"
        >
          {/* Product Image */}

          <div className="relative h-72 bg-gray-100">
            <ImageWithSkeleton
              src={product.images?.[0]}
              alt={product.productName}
              customStyle="w-full h-full object-cover"
            />

            {product.featured && (
              <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-white shadow">
                <Star size={14} fill="white" />
                Featured
              </div>
            )}
          </div>

          {/* Product Details */}

          <div className="p-6">
            <h2 className="text-2xl font-black text-[#4b0082]">
              {product.productName}
            </h2>

            <p className="mt-2 line-clamp-2 text-gray-500">
              {product.description}
            </p>

            <div className="mt-5 flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Price</p>

                <h3 className="text-xl font-bold text-green-700">
                  {priceFormat(product.price)}
                </h3>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Category</p>

                <h3 className="font-semibold capitalize">{product.category}</h3>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Stock</p>

                <h3 className="font-bold">{product.totalQuantity}</h3>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Unit</p>

                <h3 className="font-bold">{product.unit}</h3>
              </div>
            </div>

            {/* Buttons */}

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  if (!product._id) return;
                  navigate(`/admin/products/edit/${product._id}`);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4b0082] py-3 font-semibold text-white transition hover:bg-[#5c1496]"
              >
                <Pencil size={18} />
                Edit
              </button>

              <button
                onClick={() => handleDelete(product._id, product.productName)}
                className="rounded-xl bg-red-600 px-5 text-white transition hover:bg-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminProductGrid;
