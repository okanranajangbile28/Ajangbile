import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ApplicationSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-24 h-24 text-green-600" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
          Application Submitted Successfully
        </h1>

        <p className="text-gray-600 text-lg leading-8 mb-5">
          Thank you for submitting your membership application.
        </p>

        <p className="text-gray-600 leading-8 mb-5">
          Your application and payment receipt have been received successfully
          and are now awaiting review by the Membership Committee.
        </p>

        <p className="text-gray-600 leading-8 mb-8">
          Our administration will review your application and get back to you
          using the contact details you provided.
        </p>

        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-8">
          <p className="text-[#4b0082] font-semibold leading-7">
            Please keep your email and phone available for any further
            communication regarding your application.
          </p>
        </div>

        <Link
          to="/"
          className="inline-block bg-[#4b0082] hover:bg-[#360061] text-white font-semibold px-8 py-4 rounded-xl transition"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ApplicationSuccess;
