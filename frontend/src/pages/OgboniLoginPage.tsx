import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const OgboniLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      /*
       * ======================================================
       * MEMBERSHIP NOT YET APPROVED
       * ======================================================
       *
       * The backend should return:
       *
       * 403 + message containing "not yet been approved"
       *
       * Instead of showing an alert, send the member to the
       * dedicated Membership Pending page.
       */

      if (!response.ok) {
        const errorMessage = (
          data.message ||
          data.error ||
          "Login failed"
        ).toLowerCase();

        if (
          response.status === 403 &&
          (errorMessage.includes("not yet been approved") ||
            errorMessage.includes("not been approved") ||
            errorMessage.includes("pending approval") ||
            errorMessage.includes("pending"))
        ) {
          navigate("/member-account-approval", {
            replace: true,
            state: {
              email: formData.email,
            },
          });

          return;
        }

        alert(data.message || "Login failed");
        return;
      }

      /*
       * ======================================================
       * SUCCESSFUL LOGIN
       * ======================================================
       */

      if (data.token) {
        localStorage.setItem("ogboniToken", data.token);
      }

      if (data.user) {
        localStorage.setItem("ogboniMember", JSON.stringify(data.user));
      }

      navigate("/ogboni-dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Ogboni login error:", error);
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-950 flex justify-center items-center px-4 py-10">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">Member Login</h1>

          <p className="mt-4 text-gray-700 text-lg leading-relaxed">
            Confederation of Ogboni Aborigine Fraternity
            <br />
            Iledi Ajangbile
          </p>
        </div>

        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {location.state?.message && (
          <div className="mb-6 rounded-xl border border-green-400 bg-green-100 p-4 text-green-800">
            {location.state.message}
          </div>
        )}

        {/* ==================================================
            LOGIN FORM
        ================================================== */}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL */}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-purple-700"
              required
            />
          </div>

          {/* PASSWORD */}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-700"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-900 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* FORGOT PASSWORD */}

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-purple-900 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-purple-900 py-4 font-bold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* ==================================================
            SIGN UP
        ================================================== */}

        <div className="text-center mt-8">
          <p className="text-gray-600">Don't have a member account?</p>

          <Link
            to="/signup"
            className="inline-block mt-2 text-purple-900 font-semibold hover:underline"
          >
            Create Member Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OgboniLoginPage;
