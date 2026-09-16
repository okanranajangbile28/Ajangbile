import { useEffect } from "react";
import { Link } from "react-router-dom";

import { useAppSelector } from "../App/hooks";

import Explore from "../components/home/Explore";
import FAQ from "../components/home/FAQ";
import FeaturedBlogs from "../components/home/FeaturedBlogs";
import OgboniFeaturedBlogs from "../components/home/OgboniFeaturedBlogs";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Hero from "../components/home/Hero";
import Testimonials from "../components/home/Testimonials";

const HomePage = () => {
  const { products } = useAppSelector((state) => state.product);

  useEffect(() => {
    document.title = "Okanran Ajangbile | Home";
  }, []);

  /*
   * Find the Fun with the 16 Major Odu product
   * from the same products already loaded for FeaturedProducts.
   */
  const bestSellerProduct = Array.isArray(products)
    ? products.find((product) => {
        const productName = product.productName
          ?.toLowerCase()
          .replace(/\s+/g, " ")
          .trim();

        return productName === "fun with the 16 major odu";
      })
    : undefined;

  return (
    <div className="relative">
      <Hero />

      <Explore />

      <FeaturedProducts />

      {/* Normal Ajangbile Heritage Blog */}
      <FeaturedBlogs />

      {/* Ogboni Blog */}
      <OgboniFeaturedBlogs />

      <Testimonials />

      {/* Frequently Asked Questions */}
      <FAQ />

      {/* =====================================================
          FLOATING BEST SELLER PROMOTION
          ===================================================== */}
      {bestSellerProduct?._id && (
        <Link
          to={`/shop/${bestSellerProduct._id}`}
          aria-label="View Fun with the 16 Major Odu - Best Seller"
          className="
  fixed
  bottom-5
  right-4
  z-[100]
  block
  w-[105px]
  sm:w-[125px]
  md:w-[160px]
  lg:w-[175px]
  transition-all
  duration-300
  hover:scale-105
  active:scale-95
"
        >
          <img
            src="/images/fun-with-16-major-odu-best-seller.png"
            alt="Best Seller - Fun with the 16 Major Odu"
            className="
              w-full
              h-auto
              drop-shadow-2xl
            "
          />
        </Link>
      )}
    </div>
  );
};

export default HomePage;
