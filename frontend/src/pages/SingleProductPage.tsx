import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShieldCheck, Truck, CheckCircle2, ArrowLeft } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../App/hooks";
import { fetchSingleProduct } from "../features/productFeature/productSlice";

import { priceFormat } from "../utils/constants";

import SuggestedProducts from "../features/productFeature/product/SuggestedProducts";
import { AddToCart } from "../features/cartFeature/cart";

import { Loading } from "../components/global_components";
import ImageWithSkeleton from "../components/global_components/ImageWithSkeleton";

const SingleProductPage = () => {
  const { id } = useParams();

  const dispatch = useAppDispatch();

  const [selectedImage, setSelectedImage] = useState(0);

  const { single_product, single_product_loading } = useAppSelector(
    (state) => state.product,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (single_product.productName) {
      document.title = `${single_product.productName} | Ajangbile Heritage`;
    }
  }, [single_product.productName]);

  useEffect(() => {
    setSelectedImage(0);
  }, [single_product]);

  if (single_product_loading) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-50">
      {/* HERO */}

      <section className="bg-gradient-to-r from-purple-950 via-purple-900 to-purple-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-yellow-300 hover:text-white transition mb-10"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>

          <p className="uppercase tracking-[6px] text-yellow-400 font-semibold">
            Ajangbile Heritage
          </p>

          <h1 className="text-4xl md:text-6xl font-black text-white mt-5">
            {single_product.productName}
          </h1>
        </div>
      </section>

      {/* PRODUCT */}

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* LEFT */}

          <div>
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <ImageWithSkeleton
                src={
                  single_product.images?.[selectedImage] ??
                  single_product.images?.[0]
                }
                alt={single_product.productName}
                customStyle="w-full h-[550px] object-contain"
              />
            </div>

            {single_product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-6">
                {single_product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-2xl overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? "border-yellow-500"
                        : "border-gray-200"
                    }`}
                  >
                    <ImageWithSkeleton
                      src={image}
                      alt={single_product.productName}
                      customStyle="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}

          <div>
            <div className="flex flex-wrap gap-3">
              <span className="bg-purple-100 text-purple-900 px-4 py-2 rounded-full font-semibold capitalize">
                {single_product.category}
              </span>

              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                In Stock
              </span>
            </div>

            <h2 className="text-5xl font-black text-purple-950 mt-8">
              {single_product.productName}
            </h2>

            <div className="text-4xl font-black text-yellow-600 mt-6">
              {priceFormat(single_product.price)}
            </div>

            <p className="text-gray-600 leading-8 text-lg mt-8">
              {single_product.description}
            </p>

            <div className="grid gap-5 mt-10">
              <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow">
                <ShieldCheck className="text-green-600" size={28} />

                <div>
                  <h3 className="font-bold text-purple-950">Secure Payment</h3>

                  <p className="text-gray-500 text-sm">
                    Protected checkout with encrypted payment.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow">
                <Truck className="text-purple-900" size={28} />

                <div>
                  <h3 className="font-bold text-purple-950">
                    Nationwide Delivery
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Delivery available across Nigeria.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow">
                <CheckCircle2 className="text-yellow-500" size={28} />

                <div>
                  <h3 className="font-bold text-purple-950">
                    Authentic Product
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Carefully selected traditional spiritual products.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <AddToCart product={single_product} />
            </div>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}

      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl shadow-lg p-10">
          <h2 className="text-3xl font-black text-purple-950 mb-8">
            Product Description
          </h2>

          <div className="text-gray-700 leading-9 text-lg whitespace-pre-line">
            {single_product.description}
          </div>
        </div>
      </section>

      <SuggestedProducts />
    </div>
  );
};

export default SingleProductPage;
