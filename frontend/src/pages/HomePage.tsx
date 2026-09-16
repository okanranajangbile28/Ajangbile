import { useEffect, useState } from "react";
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

  const [showBestSeller, setShowBestSeller] = useState(false);

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

  /*
   * Floating Best Seller animation
   *
   * First appearance: after 2.5 seconds
   * Visible: 4 seconds
   * Hidden: 5 seconds
   * Then repeats.
   */
  useEffect(() => {
    if (!bestSellerProduct?._id) return;

    let hideTimer: ReturnType<typeof setTimeout>;
    let showTimer: ReturnType<typeof setTimeout>;

    const startAnimation = () => {
      setShowBestSeller(true);

      hideTimer = setTimeout(() => {
        setShowBestSeller(false);

        showTimer = setTimeout(() => {
          startAnimation();
        }, 5000);
      }, 4000);
    };

    showTimer = setTimeout(() => {
      startAnimation();
    }, 2500);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
    };
  }, [bestSellerProduct?._id]);

  return (
    <div className="relative">
      {/* Hero Section */}
      <Hero />

      {/* Explore Section */}
      <Explore />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Normal Ajangbile Heritage Blog */}
      <FeaturedBlogs />

      {/* Ogboni Blog */}
      <OgboniFeaturedBlogs />

      {/* Testimonials */}
      <Testimonials />

      {/* Frequently Asked Questions */}
      <FAQ />

      {/* =====================================================
          FLOATING BEST SELLER
          ===================================================== */}
      {bestSellerProduct?._id && (
        <div
          className={`
            fixed
            bottom-4
            right-3
            sm:right-4
            z-[100]
            transition-all
            duration-700
            ease-out
            ${
              showBestSeller
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-6 opacity-0 scale-75 pointer-events-none"
            }
          `}
        >
          <Link
            to={`/shop/${bestSellerProduct._id}`}
            aria-label="View Fun with the 16 Major Odu - Best Seller"
            className="
              flex
              items-center
              justify-center
              w-[58px]
              h-[58px]
              sm:w-[64px]
              sm:h-[64px]
              md:w-[72px]
              md:h-[72px]
              lg:w-[78px]
              lg:h-[78px]
              rounded-full
              overflow-hidden
              border-2
              border-[#FFD700]
              bg-[#4b0082]
              shadow-[0_5px_18px_rgba(75,0,130,0.30)]
              transition-all
              duration-300
              ease-out
              hover:scale-110
              hover:shadow-[0_8px_24px_rgba(75,0,130,0.40)]
              active:scale-95
            "
          >
            <img
              src="/images/fun-with-16-major-odu-best-seller.png"
              alt="Best Seller - Fun with the 16 Major Odu"
              className="
                w-full
                h-full
                object-cover
              "
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
