import { useEffect } from "react";
import { CreditCard, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../App/hooks";
import {
  countCartTotal,
  handleStripe,
} from "../features/cartFeature/cartSlice";

import { priceFormat } from "../utils/constants";

const CheckoutPage = () => {
  const dispatch = useAppDispatch();

  const { cart, subtotal, checkout_loading } = useAppSelector(
    (state) => state.cart,
  );

  useEffect(() => {
    document.title = "Ajangbile Heritage | Checkout";
    dispatch(countCartTotal());
  }, [dispatch]);

  const checkout = () => {
    dispatch(
      handleStripe({
        cart: cart.filter((item) => item.amount > 0),
      }),
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}

      <section className="bg-gradient-to-r from-purple-950 via-purple-900 to-purple-800 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-white">
          <p className="uppercase tracking-[6px] text-yellow-400 font-semibold">
            Secure Payment
          </p>

          <h1 className="text-5xl font-black mt-4">Checkout</h1>

          <p className="text-gray-200 mt-6 text-lg">
            Complete your order securely.
          </p>
        </div>
      </section>

      {/* Content */}

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left */}

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-10">
            <h2 className="text-3xl font-black text-purple-950 mb-8">
              Order Summary
            </h2>

            <div className="space-y-6">
              {cart.map((item) => (
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

            <Link
              to="/cart"
              className="inline-flex items-center gap-2 mt-10 text-purple-900 font-semibold hover:text-yellow-600"
            >
              <ArrowLeft size={18} />
              Back to Cart
            </Link>
          </div>

          {/* Right */}

          <div className="bg-white rounded-3xl shadow-lg p-8 h-fit sticky top-10">
            <h2 className="text-2xl font-black text-purple-950 mb-8">
              Payment
            </h2>

            <div className="space-y-5">
              <div className="flex justify-between">
                <span>Subtotal</span>

                <span className="font-bold">{priceFormat(subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>

                <span className="text-green-600 font-bold">
                  Calculated at checkout
                </span>
              </div>

              <hr />

              <div className="flex justify-between text-2xl font-black">
                <span>Total</span>

                <span className="text-yellow-600">{priceFormat(subtotal)}</span>
              </div>
            </div>

            <button
              onClick={checkout}
              disabled={checkout_loading}
              className="mt-10 w-full bg-purple-900 hover:bg-purple-800 text-white py-4 rounded-2xl font-bold flex justify-center items-center gap-3 transition disabled:opacity-60"
            >
              <CreditCard size={22} />

              {checkout_loading
                ? "Redirecting..."
                : "Proceed to Secure Payment"}
            </button>

            <div className="space-y-4 mt-10">
              <div className="flex gap-3">
                <ShieldCheck className="text-green-600" />
                <span>Encrypted & secure payment</span>
              </div>

              <div className="flex gap-3">
                <Truck className="text-purple-700" />
                <span>Nationwide delivery available</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutPage;
