import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ShopBankTransferSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderReference = searchParams.get("order");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Order Submitted Successfully
        </h1>

        <p className="text-gray-600 leading-7 mb-6">
          Your bank transfer order has been submitted successfully and is now
          awaiting payment verification.
        </p>

        {orderReference && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Order Reference</p>

            <p className="text-lg font-bold text-gray-900 break-all">
              {orderReference}
            </p>
          </div>
        )}

        <p className="text-gray-600 leading-7 mb-8">
          Please keep your order reference for your records. Your order will be
          processed after your bank transfer has been verified.
        </p>

        <Link
          to="/"
          className="inline-block bg-purple-800 hover:bg-purple-900 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ShopBankTransferSuccess;
