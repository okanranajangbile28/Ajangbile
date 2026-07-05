import { Link, useLocation } from "react-router-dom";
import { priceFormat } from "../../../utils/constants";
import { SingleProductType } from "../../../types/product";
import ImageWithSkeleton from "../../../components/global_components/ImageWithSkeleton";

const Product = ({
  images,
  _id: id,
  productName: name,
  price,
  customStyle,
}: SingleProductType & { customStyle?: string }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <Link
      to={`${isAdmin ? `/admin/product/${id}` : `/shop/${id}`}`}
      className={`flex flex-col bg-[#EFEBE7] hover:bg-[rgba(75,0,130,0.87)] rounded-md overflow-hidden aspect-[297/411] w-full h-full text-[#4b0082] hover:text-white transition-colors duration-300 ${customStyle ?? ""}`}
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square overflow-hidden">
        <ImageWithSkeleton
          src={images[0]}
          alt={name}
          customStyle="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex justify-between items-center px-3 lg:px-4 py-3 gap-3 flex-1">
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <h3
            className="font-Monda text-sm lg:text-base leading-5 capitalize truncate"
            title={name}
          >
            {name}
          </h3>

          <p className="font-Monda font-semibold text-base lg:text-lg">
            {priceFormat(price)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Product;
