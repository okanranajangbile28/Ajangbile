import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../App/hooks";

import { countCartTotal } from "../features/cartFeature/cartSlice";

import { CartItem } from "../features/cartFeature/cart";

import SuggestedProducts from "../features/productFeature/product/SuggestedProducts";

import { priceFormat } from "../utils/constants";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cart, subtotal } = useAppSelector((state) => state.cart);

  // ======================================================
  // CART TOTAL
  // ======================================================

  useEffect(() => {
    dispatch(countCartTotal());

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, dispatch]);

  // ======================================================
  // PAGE TITLE
  // ======================================================

  useEffect(() => {
    document.title = "Ajangbile Heritage | Shopping Cart";
  }, []);

  // ======================================================
  // PROCEED TO CHECKOUT
  // ======================================================

  const handleCheckout = () => {
    const validCart = cart.filter((item) => item.amount > 0);

    if (!validCart.length) {
      return;
    }

    /*
     * IMPORTANT:
     *
     * Do NOT call handleStripe() here.
     *
     * The user must first go to the Checkout page
     * where they can choose:
     *
     * 1. Card / Stripe
     * 2. Bank Transfer
     */

    navigate("/checkout");
  };

  // ======================================================
  // EMPTY CART
  // ======================================================

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

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="bg-gray-50">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="bg-gradient-to-r from-purple-950 via-purple-900 to-purple-800 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <p className="uppercase tracking-[6px] text-yellow-400 font-semibold">
            Shopping Cart
          </p>

          <h1 className="text-5xl font-black mt-4">Review Your Order</h1>
        </div>
      </section>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid xl:grid-cols-3 gap-10">
          {/* ==================================================
              CART ITEMS
          ================================================== */}

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

          {/* ==================================================
              ORDER SUMMARY
          ================================================== */}

          <div>
            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-8">
              <h2 className="text-3xl font-black text-purple-950">
                Order Summary
              </h2>

              {/* SUBTOTAL */}

              <div className="flex justify-between mt-10 text-lg">
                <span>Subtotal</span>

                <span className="font-bold">{priceFormat(subtotal)}</span>
              </div>

              {/* DELIVERY */}

              <div className="flex justify-between mt-5 text-lg">
                <span>Delivery</span>

                <span className="text-green-600 font-bold text-right">
                  Calculated at Checkout
                </span>
              </div>

              <hr className="my-8" />

              {/* TOTAL */}

              <div className="flex justify-between text-2xl font-black text-purple-950">
                <span>Total</span>

                <span>{priceFormat(subtotal)}</span>
              </div>

              {/* ==================================================
                  PROCEED TO CHECKOUT
              ================================================== */}

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-10 w-full bg-yellow-500 hover:bg-yellow-400 text-purple-950 font-bold rounded-2xl py-5 transition"
              >
                Proceed to Checkout
              </button>

              <p className="text-gray-500 text-sm text-center mt-6">
                Choose your preferred payment method on the next page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SUGGESTED PRODUCTS
      ================================================== */}

      <SuggestedProducts />
    </div>
  );
};

export default CartPage;
