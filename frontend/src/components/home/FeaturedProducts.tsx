import { Link } from "react-router-dom";
import GridView from "../../features/productFeature/product/GridView";
import { useAppSelector } from "../../App/hooks";
import { Loading } from "../global_components";

const FeaturedProducts = () => {
  const { featured_product } = useAppSelector((state) => state.filter);
  const { products_loading, products_error } = useAppSelector(
    (state) => state.product,
  );
  return (
    <div className="flex flex-col pt-[60px] px-[10px] bg-white z-2 gap-4 lg:pl-[46px]">
      <div className="flex flex-col gap-[17px] pt-[20px] max-sm:text-center">
        <div className="font-Open text-[18px] sm:text-[20px] leading-[32px] text-[#c4c4c4]">
          Products
        </div>
        <div className="font-Manrope text-[24px] sm:text-[32px] lg:text-[48px] leading-[28px] sm:leading-[40px] md:leading-[60px] text-[#4b0082]">
          Buy from our collections of products
        </div>
      </div>
      {products_loading ? (
        <Loading />
      ) : products_error ? (
        <div style={{ color: "red", padding: "20px" }}>{products_error}</div>
      ) : (
        <>
          <GridView
            products={featured_product.slice(0, 4)}
            customStyle="min-h-[300px] grid-cols-5 max-[1200px]:grid-cols-4 max-[1100px]:grid-cols-3 max-[700px]:grid-cols-2 max-[430px]:flex max-[430px]:overflow-x-scroll max-sm:gap-x-[12px] max-sm:px-[10px] w-full md:px-0"
          />
          <div className="flex justify-end sm:px-[88px]">
            <Link
              to={"/shop"}
              className="py-[8px] px-[12px] md:py-[14px] md:px-[32px] items-center justify-center border-2 border-[#4b0082] rounded-[56px] font-Open font-bold text-[14px] md:text-[20px] leading-[28px] text-[#3f3843] hover:bg-[#4b0082] hover:text-white"
            >
              All products
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedProducts;
