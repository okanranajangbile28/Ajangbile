import { Link } from "react-router-dom";

const MemberAccountPending = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Your Member Account Is Awaiting Approval
        </h1>

        <p className="text-gray-600 text-lg leading-8 mb-5">
          Thank you for signing up with the Confederation of Ogboni Aborigine
          Fraternity, Iledi Ajangbile.
        </p>

        <p className="text-gray-600 text-lg leading-8 mb-8">
          Your account is currently awaiting approval. Once your account has
          been approved, you will receive an email with further instructions.
        </p>

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

export default MemberAccountPending;
