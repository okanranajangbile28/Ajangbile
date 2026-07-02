import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OgboniSignupPage = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    occupation: "",
    chiefTitle: "",
    state: "",
    lga: "",
    city: "",
    address: "",
    reason: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/signup`,
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
        navigate("/ogboni-login", {
          replace: true,
          state: {
            message:
              "Your membership application has been submitted successfully. Please wait for approval before logging in.",
          },
        });
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-900">
            Ogboni Membership Application Form
          </h1>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-red-400 bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            <input
              type="text"
              name="chiefTitle"
              placeholder="Chieftaincy Title (Optional)"
              value={formData.chiefTitle}
              onChange={handleChange}
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            <input
              type="text"
              name="lga"
              placeholder="Local Government Area"
              value={formData.lga}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="border p-4 rounded-xl md:col-span-2"
              required
            />

            <textarea
              name="reason"
              placeholder="Why do you want to join?"
              value={formData.reason}
              onChange={handleChange}
              className="border p-4 rounded-xl md:col-span-2"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-purple-900 text-white px-10 py-4 rounded-full hover:bg-purple-800 transition"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default OgboniSignupPage;
