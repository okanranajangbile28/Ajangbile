import { useEffect } from "react";
import {
  CreditCard,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Landmark,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../App/hooks";

import {
  countCartTotal,
  handleStripe,
} from "../features/cartFeature/cartSlice";

import { priceFormat } from "../utils/constants";

const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    cart,
    subtotal,
    checkout_loading,
    shippingInfo,
    total_items,
    total_amount,
  } = useAppSelector((state) => state.cart);

  // ======================================================
  // PAGE SETUP
  // ======================================================

  useEffect(() => {
    document.title = "Ajangbile Heritage | Checkout";

    dispatch(countCartTotal());
  }, [dispatch]);

  // ======================================================
  // PAY WITH STRIPE / CARD
  // ======================================================

  const checkoutWithStripe = () => {
    const validCart = cart.filter((item) => item.amount > 0);

    if (!validCart.length) {
      alert("Your cart is empty.");
      return;
    }

    dispatch(
      handleStripe({
        cart: validCart,
        shippingInfo,
        subtotal,
        total_items,
        total_amount: total_amount || subtotal,
      }),
    );
  };

  // ======================================================
  // PAY WITH BANK TRANSFER
  // ======================================================
  //
  // We do NOT create the bank-transfer order here.
  //
  // The user will be taken to the Bank Transfer Payment page
  // where they can:
  //
  // 1. Enter shipping information
  // 2. See the bank account details
  // 3. See the amount to transfer
  // 4. Enter transfer reference
  // 5. Upload the payment receipt
  // 6. Submit the payment
  //
  // ======================================================

  const checkoutWithBankTransfer = () => {
    const validCart = cart.filter((item) => item.amount > 0);

    if (!validCart.length) {
      alert("Your cart is empty.");
      return;
    }

    navigate("/shop-bank-transfer-payment");
  };

  // ======================================================
  // STRIPE LOADING
  // ======================================================

  const paymentLoading = checkout_loading;

  // ======================================================
  // EMPTY CART
  // ======================================================

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg w-full text-center">
          <Landmark size={70} className="mx-auto text-purple-900 mb-6" />

          <h1 className="text-4xl font-black text-purple-950">
            Your Cart is Empty
          </h1>

          <p className="mt-4 text-gray-600 leading-7">
            Please add products to your cart before proceeding to checkout.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-3 mt-10 bg-purple-900 hover:bg-purple-800 text-white px-8 py-4 rounded-full font-bold transition"
          >
            Visit Shop
          </Link>
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="bg-gradient-to-r from-purple-950 via-purple-900 to-purple-800 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-white">
          <p className="uppercase tracking-[6px] text-yellow-400 font-semibold">
            Secure Payment
          </p>

          <h1 className="text-5xl font-black mt-4">Checkout</h1>

          <p className="text-gray-200 mt-6 text-lg">
            Choose how you would like to pay for your order.
          </p>
        </div>
      </section>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* ==================================================
              ORDER SUMMARY
          ================================================== */}

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-10">
            <h2 className="text-3xl font-black text-purple-950 mb-8">
              Order Summary
            </h2>

            <div className="space-y-6">
              {cart
                .filter((item) => item.amount > 0)
                .map((item) => (
                  <div
                    key={item.productID}
                    className="flex justify-between items-center border-b pb-5"
                  >
                    <div>
                      <h3 className="font-bold text-purple-950">
                        {item.productName}
                      </h3>

                      <p className="text-gray-500">Qty: {item.amount}</p>
                    </div>

                    <div className="font-bold text-lg text-purple-900">
                      {priceFormat(item.price * item.amount)}
                    </div>
                  </div>
                ))}
            </div>

            {/* BACK TO CART */}

            <Link
              to="/cart"
              className="inline-flex items-center gap-2 mt-10 text-purple-900 font-semibold hover:text-yellow-600"
            >
              <ArrowLeft size={18} />
              Back to Cart
            </Link>
          </div>

          {/* ==================================================
              PAYMENT
          ================================================== */}

          <div className="bg-white rounded-3xl shadow-lg p-8 h-fit sticky top-10">
            <h2 className="text-2xl font-black text-purple-950 mb-8">
              Payment
            </h2>

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="space-y-5">
              {/* SUBTOTAL */}

              <div className="flex justify-between gap-4">
                <span className="text-gray-700">Subtotal</span>

                <span className="font-bold text-purple-950">
                  {priceFormat(subtotal)}
                </span>
              </div>

              {/* DELIVERY */}

              <div className="flex justify-between gap-4">
                <span className="text-gray-700">Delivery</span>

                <span className="text-green-600 font-bold text-right">
                  Calculated at checkout
                </span>
              </div>

              <hr />

              {/* TOTAL */}

              <div className="flex justify-between items-center text-2xl font-black">
                <span className="text-purple-950">Total</span>

                <span className="text-yellow-600">
                  {priceFormat(total_amount || subtotal)}
                </span>
              </div>
            </div>

            {/* ==================================================
                PAYMENT METHODS
            ================================================== */}

            <div className="mt-10">
              <h3 className="text-lg font-bold text-purple-950 mb-4">
                Choose Payment Method
              </h3>

              {/* ==================================================
                  STRIPE / CARD
              ================================================== */}

              <button
                type="button"
                onClick={checkoutWithStripe}
                disabled={paymentLoading}
                className="w-full bg-purple-900 hover:bg-purple-800 text-white py-4 px-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {checkout_loading ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <CreditCard size={22} />
                )}

                {checkout_loading
                  ? "Redirecting to Stripe..."
                  : "Pay with Card / Stripe"}
              </button>

              {/* ==================================================
                  BANK TRANSFER
              ================================================== */}

              <button
                type="button"
                onClick={checkoutWithBankTransfer}
                disabled={checkout_loading}
                className="w-full mt-4 border-2 border-purple-900 text-purple-900 hover:bg-purple-50 py-4 px-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Landmark size={22} />
                Pay with Bank Transfer
              </button>

              <p className="text-sm text-gray-500 text-center mt-4 leading-6">
                Choose bank transfer to enter your shipping details, view our
                official bank account information, and upload your payment
                receipt.
              </p>
            </div>

            {/* ==================================================
                SECURITY
            ================================================== */}

            <div className="space-y-4 mt-10">
              <div className="flex gap-3">
                <ShieldCheck className="text-green-600 shrink-0" />

                <span className="text-gray-700">Secure payment processing</span>
              </div>

              <div className="flex gap-3">
                <Truck className="text-purple-700 shrink-0" />

                <span className="text-gray-700">
                  Nationwide delivery available
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutPage;
