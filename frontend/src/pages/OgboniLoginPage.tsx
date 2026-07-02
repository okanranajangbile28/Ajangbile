import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OgboniLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

      if (response.ok) {
        // Save member information
        localStorage.setItem("ogboniMember", JSON.stringify(data.user));

        // Go directly to dashboard
        navigate("/ogboni-dashboard", { replace: true });
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-purple-950 flex justify-center items-center px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900">Member Login</h1>

          <p className="mt-4 text-gray-700 text-lg leading-relaxed">
            Confederation of Ogboni Aborigine Fraternity,
            <br />
            Iledi Ajangbile.
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
            className="w-full border rounded-xl p-4"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-xl p-4"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-900 text-white py-4 rounded-xl font-bold hover:bg-purple-800 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default OgboniLoginPage;
