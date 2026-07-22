import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl p-10 text-center">
        <CheckCircle className="mx-auto text-green-600 mb-6" size={90} />

        <h1 className="text-4xl font-bold text-[#4b0082] mb-4">
          Payment Successful
        </h1>

        <p className="text-gray-700 text-lg leading-8 mb-8">
          Thank you for completing your initiation payment.
          <br />
          Your payment has been verified successfully.
        </p>

        <div className="bg-green-50 border border-green-300 rounded-xl p-6 mb-8">
          <p className="text-green-700 font-semibold text-lg">
            Your application status has now been updated to
          </p>

          <h2 className="text-3xl font-bold text-green-700 mt-2">PAID</h2>
        </div>

        <p className="text-gray-700 leading-8 mb-10">
          The administration will contact you shortly with your:
        </p>

        <ul className="text-left max-w-md mx-auto text-gray-700 space-y-3 mb-10">
          <li>✓ Initiation Date</li>
          <li>✓ Initiation Time</li>
          <li>✓ Venue</li>
          <li>✓ Further Instructions</li>
        </ul>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-[#4b0082] text-white px-8 py-3 rounded-lg hover:bg-purple-900 transition"
          >
            Return Home
          </Link>

          <Link
            to="/iledi-ajangbile"
            className="border-2 border-[#4b0082] text-[#4b0082] px-8 py-3 rounded-lg hover:bg-[#4b0082] hover:text-white transition"
          >
            Member Portal
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;
