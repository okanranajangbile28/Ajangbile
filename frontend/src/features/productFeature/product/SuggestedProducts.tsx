import { Link } from "react-router-dom";
import { useAppSelector } from "../../../App/hooks";
import GridView from "./GridView";

const SuggestedProducts = () => {
  const { products } = useAppSelector((state) => state.product);

  return (
    <div className="flex flex-col items-center pt-[24px] pb-[10px] px-[10px] gap-[24px] bg-white overflow-x-hidden">
      <div className="flex pt-[20px] min-[550px]:pl-[46px] w-full">
        <div className="flex flex-col gap-[17px]">
          <div className="font-Open text-[16px] md:text-[20px] leading-[32px] flex items-center text-[#c4c4c4]">
            More products
          </div>

          <div className="font-Manrope text-[28px] md:text-[32px] lg:text-[48px] leading-[32px] md:leading-[48px] lg:leading-[60px] text-[#4b0082]">
            See other amazing products
          </div>
        </div>
      </div>

      <div className="w-full lg:py-[24px] overflow-hidden">
        <GridView
          products={[...products.slice(0, 4)]}
          customStyle="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
          productStyle="w-full min-w-0"
        />
      </div>

      <div className="flex justify-end sm:px-[88px] w-full">
        <Link
          to="/shop"
          className="py-[8px] px-[12px] md:py-[14px] md:px-[32px] items-center justify-center border-2 border-[#4b0082] rounded-[56px] font-Open font-bold text-[14px] md:text-[20px] leading-[28px] text-[#3f3843]"
        >
          See More
        </Link>
      </div>
    </div>
  );
};

export default SuggestedProducts;
