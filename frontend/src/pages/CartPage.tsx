import { KeyboardEvent, MouseEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { PulseLoader } from "react-spinners";

import { useAppDispatch, useAppSelector } from "../App/hooks";

import {
  countCartTotal,
  handleStripe,
} from "../features/cartFeature/cartSlice";

import { CartItem } from "../features/cartFeature/cart";

import SuggestedProducts from "../features/productFeature/product/SuggestedProducts";

import { priceFormat } from "../utils/constants";

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
    document.title = "Ajangbile Heritage | Shopping Cart";
  }, []);

  const handleCheckout = (
    e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();

    dispatch(
      handleStripe({
        cart: cart.filter((item) => item.amount > 0),
      }),
    );
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg w-full text-center">
          <ShoppingBag size={70} className="mx-auto text-purple-900 mb-6" />

          <h1 className="text-4xl font-black text-purple-950">
            Your Cart is Empty
          </h1>

          <p className="mt-4 text-gray-600 leading-7">
            Browse our collection of authentic spiritual products and begin your
            journey today.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-3 mt-10 bg-purple-900 hover:bg-purple-800 text-white px-8 py-4 rounded-full font-bold transition"
          >
            Visit Shop
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero */}

      <section className="bg-gradient-to-r from-purple-950 via-purple-900 to-purple-800 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <p className="uppercase tracking-[6px] text-yellow-400 font-semibold">
            Shopping Cart
          </p>

          <h1 className="text-5xl font-black mt-4">Review Your Order</h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid xl:grid-cols-3 gap-10">
          {/* Cart */}

          <div className="xl:col-span-2 bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-3xl font-black text-purple-950 mb-8">
              Cart Items
            </h2>

            <div className="space-y-8">
              {cart.map((item) => (
                <CartItem key={item.productID} data={item} />
              ))}
            </div>
          </div>

          {/* Summary */}

          <div>
            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-8">
              <h2 className="text-3xl font-black text-purple-950">
                Order Summary
              </h2>

              <div className="flex justify-between mt-10 text-lg">
                <span>Subtotal</span>

                <span className="font-bold">{priceFormat(subtotal)}</span>
              </div>

              <div className="flex justify-between mt-5 text-lg">
                <span>Delivery</span>

                <span className="text-green-600 font-bold">
                  Calculated at Checkout
                </span>
              </div>

              <hr className="my-8" />

              <div className="flex justify-between text-2xl font-black text-purple-950">
                <span>Total</span>

                <span>{priceFormat(subtotal)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkout_loading}
                className="mt-10 w-full bg-yellow-500 hover:bg-yellow-400 text-purple-950 font-bold rounded-2xl py-5 transition"
              >
                {checkout_loading ? (
                  <div className="flex justify-center items-center gap-3">
                    Processing
                    <PulseLoader size={6} color="#4b0082" />
                  </div>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>

              <p className="text-gray-500 text-sm text-center mt-6">
                Secure payment powered by Stripe.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SuggestedProducts />
    </div>
  );
};

export default CartPage;
