import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OgboniSignupPage = () => {
  const navigate = useNavigate();

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

    console.log("FORM DATA SENT:", formData); // 👈 DEBUG

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/ogboni/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Membership application submitted successfully!");
        navigate("/login");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
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

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="border p-4 rounded-xl"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="border p-4 rounded-xl"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border p-4 rounded-xl"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="border p-4 rounded-xl"
            />

            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="border p-4 rounded-xl"
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border p-4 rounded-xl"
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
            />

            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              name="chiefTitle"
              placeholder="Chieftaincy Title"
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
            />

            <input
              type="text"
              name="lga"
              placeholder="Local Government Area"
              value={formData.lga}
              onChange={handleChange}
              className="border p-4 rounded-xl"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="border p-4 rounded-xl"
            />

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="border p-4 rounded-xl md:col-span-2"
            />

            <textarea
              name="reason"
              placeholder="Why do you want to join?"
              value={formData.reason}
              onChange={handleChange}
              className="border p-4 rounded-xl md:col-span-2"
            />
          </div>

          <button
            type="submit"
            className="bg-purple-900 text-white px-10 py-4 rounded-full"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default OgboniSignupPage;
