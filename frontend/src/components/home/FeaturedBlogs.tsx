import { Link } from "react-router-dom";

const FeaturedBlogs = () => {
  return (
    <div className="flex flex-col items-start pt-[40px] pb-[30px] px-[10px] lg:pl-[56px] bg-white gap-6">
      <div className="flex flex-col gap-[17px] pt-[20px] w-full max-sm:text-center">
        <div className="font-Open text-[18px] sm:text-[20px] leading-[32px] text-[#c4c4c4]">
          Blog
        </div>

        <div className="font-Manrope text-[24px] sm:text-[32px] lg:text-[48px] leading-[28px] sm:leading-[40px] md:leading-[60px] text-[#4b0082]">
          Read our engaging stories
        </div>
      </div>

      <div className="min-h-[220px] flex flex-col items-center justify-center text-center gap-5 w-full">
        <h3 className="text-2xl font-bold text-[#4b0082]">
          New Articles Coming Soon
        </h3>

        <p className="max-w-xl text-gray-600">
          We are preparing educational articles about Ifa, Ogboni, African
          spirituality and traditional wisdom. Stay tuned.
        </p>

        <Link
          to="/blog"
          className="py-[12px] px-[28px] border-2 border-[#4b0082] rounded-full text-[#4b0082] font-semibold hover:bg-[#4b0082] hover:text-white transition"
        >
          Visit Blog
        </Link>
      </div>
    </div>
  );
};

export default FeaturedBlogs;
