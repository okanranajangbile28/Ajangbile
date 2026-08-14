import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/user/admin-forgot-password`,
        {
          email,
        },
      );

      setMessage(
        response.data.message ||
          "A password reset link has been sent to your email.",
      );

      setEmail("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-purple-900">
          Admin Password Reset
        </h1>

        <p className="text-center text-gray-600 mt-2 mb-6">
          Enter your admin email address and we'll send you a password reset
          link.
        </p>

        {message && (
          <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Admin Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your admin email"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-700"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-lg bg-purple-800 py-3 font-semibold text-white transition hover:bg-purple-900 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/admin-login"
            className="text-sm font-medium text-purple-800 hover:underline"
          >
            ← Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
