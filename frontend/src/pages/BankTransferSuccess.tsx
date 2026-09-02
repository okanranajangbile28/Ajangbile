import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const BankTransferSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Submitted Successfully
        </h1>

        <p className="text-gray-600 leading-7 mb-6">
          Your bank transfer receipt has been submitted successfully and is now
          awaiting verification.
        </p>

        <p className="text-gray-600 leading-7 mb-8">
          After your payment has been verified, your initiation schedule will be
          sent to you.
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

export default BankTransferSuccess;
