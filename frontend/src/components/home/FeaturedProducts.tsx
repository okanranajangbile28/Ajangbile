import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  return (
    <div className="flex flex-col pt-[60px] px-[10px] bg-white gap-6 lg:pl-[46px]">
      <div className="flex flex-col gap-[17px] pt-[20px] max-sm:text-center">
        <div className="font-Open text-[18px] sm:text-[20px] leading-[32px] text-[#c4c4c4]">
          Products
        </div>

        <div className="font-Manrope text-[24px] sm:text-[32px] lg:text-[48px] leading-[28px] sm:leading-[40px] md:leading-[60px] text-[#4b0082]">
          Buy from our collections of products
        </div>
      </div>

      <div className="min-h-[220px] flex flex-col items-center justify-center text-center gap-5">
        <h3 className="text-2xl font-bold text-[#4b0082]">
          Online Store Coming Soon
        </h3>

        <p className="max-w-xl text-gray-600">
          We are preparing our collection of spiritual items, herbs, books and
          sacred materials. Our online shop will be available very soon.
        </p>

        <Link
          to="/shop"
          className="py-[12px] px-[28px] border-2 border-[#4b0082] rounded-full text-[#4b0082] font-semibold hover:bg-[#4b0082] hover:text-white transition"
        >
          Visit Shop
        </Link>
      </div>
    </div>
  );
};

export default FeaturedProducts;
