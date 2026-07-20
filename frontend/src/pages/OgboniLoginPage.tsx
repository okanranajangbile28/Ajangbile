import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const OgboniLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Save token if backend returns one
      if (data.token) {
        localStorage.setItem("ogboniToken", data.token);
      }

      // Save logged-in member
      localStorage.setItem("ogboniMember", JSON.stringify(data.user));

      navigate("/ogboni-dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-950 flex justify-center items-center px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">Member Login</h1>

          <p className="mt-4 text-gray-700 text-lg leading-relaxed">
            Confederation of Ogboni Aborigine Fraternity
            <br />
            Iledi Ajangbile
          </p>
        </div>

        {location.state?.message && (
          <div className="mb-6 rounded-xl border border-green-400 bg-green-100 p-4 text-green-800">
            {location.state.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-purple-700"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border p-4 focus:outline-none focus:ring-2 focus:ring-purple-700"
            required
          />

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-purple-900 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-purple-900 py-4 font-bold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OgboniLoginPage;
