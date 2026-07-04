import { useState } from "react";
import { Link } from "react-router-dom";

const OgboniForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      setMessage(
        data.message ||
          "If an account exists for this email, a password reset link has been sent.",
      );
    } catch (err) {
      console.error(err);

      setMessage(
        "Unable to process your request at this time. Please try again later.",
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-purple-950 flex justify-center items-center px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">
            Forgot Password
          </h1>

          <p className="mt-4 text-gray-700 leading-relaxed">
            Enter the email address associated with your membership account.
            We'll send you a secure password reset link.
          </p>
        </div>

        {message && (
          <div className="mb-6 bg-green-100 border border-green-400 rounded-xl p-4 text-green-800 text-sm leading-relaxed">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            required
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl p-4"
          />

          <button
            disabled={loading}
            className="w-full bg-purple-900 text-white py-4 rounded-xl font-bold hover:bg-purple-800 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link
            to="/ogboni-login"
            className="text-purple-900 font-semibold hover:underline"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OgboniForgotPassword;
