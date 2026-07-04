import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OgboniResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/reset-password/${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/ogboni-login", {
          replace: true,
          state: {
            message:
              "Your password has been reset successfully. Please login with your new password.",
          },
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to reset password.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-purple-950 flex justify-center items-center px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">Reset Password</h1>

          <p className="mt-4 text-gray-700 leading-relaxed">
            Create a new secure password for your membership account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            required
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl p-4"
          />

          <input
            type="password"
            required
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded-xl p-4"
          />

          <button
            disabled={loading}
            className="w-full bg-purple-900 text-white py-4 rounded-xl font-bold hover:bg-purple-800 transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OgboniResetPassword;
