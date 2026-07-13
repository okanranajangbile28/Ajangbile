import { useEffect } from "react";
import { Plus, Package, Star, Shapes } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../App/hooks";
import { fetchProducts } from "../features/productFeature/productSlice";
import AdminProductGrid from "../components/admin/AdminProductGrid";

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const { products, products_loading } = useAppSelector(
    (state) => state.product,
  );

  const totalProducts = products.length;

  const featuredProducts = products.filter(
    (product) => product.featured,
  ).length;

  const totalCategories = [
    ...new Set(products.map((product) => product.category)),
  ].length;

  return (
    <div className="min-h-screen bg-gray-100 p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-[#4b0082]">
            Product Management
          </h1>

          <p className="text-gray-600 mt-2">
            Manage your online store products.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/products/create")}
          className="flex items-center gap-3 bg-[#4b0082] hover:bg-[#5d1699] text-white px-7 py-4 rounded-xl font-semibold shadow-lg transition-all"
        >
          <Plus size={22} />
          Add New Product
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm uppercase">Total Products</p>

            <h2 className="text-5xl font-black text-[#4b0082] mt-2">
              {totalProducts}
            </h2>
          </div>

          <Package size={42} className="text-[#4b0082]" />
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm uppercase">Featured Products</p>

            <h2 className="text-5xl font-black text-yellow-500 mt-2">
              {featuredProducts}
            </h2>
          </div>

          <Star size={42} className="text-yellow-500" />
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm uppercase">Categories</p>

            <h2 className="text-5xl font-black text-green-600 mt-2">
              {totalCategories}
            </h2>
          </div>

          <Shapes size={42} className="text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        {products_loading ? (
          <div className="flex justify-center items-center py-24">
            <p className="text-xl font-semibold text-[#4b0082]">
              Loading products...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-[#4b0082]">
              No Products Available
            </h2>

            <p className="text-gray-500 mt-3">
              Click the button above to create your first product.
            </p>

            <button
              onClick={() => navigate("/admin/products/create")}
              className="mt-8 bg-[#4b0082] hover:bg-[#5d1699] text-white px-8 py-4 rounded-xl font-semibold transition"
            >
              Create Product
            </button>
          </div>
        ) : (
          <AdminProductGrid products={products} />
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
