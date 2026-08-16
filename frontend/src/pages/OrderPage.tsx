import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const OrderPage = () => {
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    document.title = "Ajangbile Heritage | Payment Successful";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-20">
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full p-10 md:p-14 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-green-100 rounded-full p-5">
            <CheckCircle size={70} className="text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <p className="uppercase tracking-[5px] text-yellow-600 font-semibold">
          Payment Successful
        </p>

        <h1 className="text-4xl md:text-5xl font-black text-purple-950 mt-4">
          Thank You For Your Order
        </h1>

        <p className="text-gray-600 text-lg leading-8 mt-6">
          Your payment has been received successfully and your order is now
          being processed.
        </p>

        <p className="text-gray-500 mt-4">
          We will prepare your order for delivery and keep you updated about its
          progress.
        </p>

        {/* Stripe Session Reference */}
        {sessionId && (
          <div className="mt-8 bg-gray-50 rounded-2xl p-5">
            <p className="text-sm text-gray-500">Payment Reference</p>

            <p className="text-sm font-semibold text-purple-900 break-all mt-2">
              {sessionId}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 bg-purple-900 hover:bg-purple-800 text-white px-7 py-4 rounded-full font-bold transition"
          >
            <ShoppingBag size={20} />
            Continue Shopping
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-purple-900 text-purple-900 hover:bg-purple-50 px-7 py-4 rounded-full font-bold transition"
          >
            Back to Home
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
