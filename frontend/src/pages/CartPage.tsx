import SuggestedProducts from "../features/productFeature/product/SuggestedProducts";
import { CartItem } from "../features/cartFeature/cart";
import { priceFormat } from "../utils/constants";
import { useAppDispatch, useAppSelector } from "../App/hooks";
import { KeyboardEvent, MouseEvent, useEffect } from "react";
import {
  countCartTotal,
  handleStripe,
} from "../features/cartFeature/cartSlice";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";

const CartPage = () => {
  const dispatch = useAppDispatch();

  const { cart, subtotal, checkout_loading } = useAppSelector(
    (state) => state.cart,
  );

  useEffect(() => {
    dispatch(countCartTotal());
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, dispatch]);

  useEffect(() => {
    document.title = "Okanran Ajangbile | Cart";
  }, []);

  const handleCheckout = (
    e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    dispatch(
      handleStripe({
        cart: cart.filter((c) => c.amount > 0),
      }),
    );
  };

  return cart.length < 1 ? (
    <div className="min-h-[70vh] grid justify-center pt-[50px] font-Monda bg-[rgba(75,0,130,0.05)] py-[25px]">
      <div className="flex flex-col items-center gap-4">
        <div className="font-bold text-[30px] text-[#783da1]">
          Cart is Empty
        </div>

        <Link
          to="/shop"
          className="text-[24px] bg-[#4b0082] text-white py-3 px-8 rounded-sm"
        >
          Fill it
        </Link>
      </div>
    </div>
  ) : (
    <div className="flex flex-col pt-[20px] pb-[80px] bg-white">
      <div className="font-Open text-[20px] leading-[32px] text-[#4b0082] pl-[24px] md:pl-[82px] font-semibold">
        Cart Page
      </div>

      <div className="flex flex-col lg:items-center pt-[24px] px-[10px] pb-[10px] gap-[24px] bg-white">
        <div className="grid xl:grid-cols-2 px-[4px] md:px-[30px] lg:px-[53px] gap-[27px]">
          <div className="grid max-lg:gap-[40px] gap-[24px] px-[10px] lg:h-[50vh] lg:overflow-y-scroll">
            {cart.map((item) => (
              <CartItem key={item.productID} data={item} />
            ))}
          </div>

          <div className="flex flex-col gap-[18px]">
            <div className="flex flex-col gap-[24px]">
              <div className="flex flex-col">
                <div className="font-Open text-[20px] leading-[32px] flex items-center text-[#c4c4c4]">
                  Products
                </div>

                <div className="flex justify-between">
                  <div className="font-Manrope font-bold text-[24px] leading-[60px] text-[rgba(0,0,0,0.7)]">
                    Total:
                  </div>

                  <div className="font-Manrope font-bold text-[24px] leading-[60px] text-[#4b0082]">
                    {priceFormat(subtotal)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button
                className="font-Inter font-semibold text-[14px] leading-[14px] text-[#f3f3f3] bg-[#4b0082] py-[12px] px-[32px] gap-[8px] rounded-[8px] w-full"
                onClick={handleCheckout}
                disabled={checkout_loading}
              >
                {checkout_loading ? (
                  <>
                    <span>Loading </span>

                    <PulseLoader size={5} color="#fff" speedMultiplier={0.8} />
                  </>
                ) : (
                  "Checkout"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <SuggestedProducts />
    </div>
  );
};

export default CartPage;
