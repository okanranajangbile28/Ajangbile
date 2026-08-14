import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const OgboniSignupPage = () => {
  const navigate = useNavigate();

  const initialFormData = {
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
  };

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [image, setImage] = useState<File | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    const body = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      body.append(key, value);
    });

    if (image) {
      body.append("image", image);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/signup`,
        {
          method: "POST",
          body,
        },
      );

      const data = await response.json();

      if (response.ok) {
        setFormData(initialFormData);
        setImage(null);
        setSuccess(true);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }

      setError(data.message || "Something went wrong.");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server. Please try again.");
    }
  };

  // SUCCESS SCREEN
  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 py-16 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10 text-center">
          <img
            src="/images/crest.png"
            alt="Iledi Ajangbile Crest"
            className="mx-auto mb-6 w-28"
          />

          <h1 className="text-3xl font-bold text-purple-900">
            Application Submitted Successfully
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-700">
            Thank you for applying for an online member account with{" "}
            <strong>
              Confederation of Ogboni Aborigine Fraternity of Nigeria
            </strong>
            , Ogun State Chapter – Iledi Ajangbile.
          </p>

          <p className="mt-4 text-gray-700 leading-8">
            Your application has been received successfully and is currently
            awaiting administrative review.
          </p>

          <p className="mt-4 text-gray-700 leading-8">
            Once your application has been approved, you will receive an email
            notification. You can then log in and access your member account.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-8 rounded-xl bg-purple-900 px-8 py-4 font-bold text-white hover:bg-purple-800 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-900">
            Member Account Application Form
          </h1>

          <p className="mt-4 text-gray-600 max-w-3xl mx-auto leading-7">
            Complete this application to request an online member account. Your
            application will be reviewed by an administrator. Once approved, you
            will be able to log in and access the members-only area of the Iledi
            Ajangbile portal.
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-red-400 bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold">Profile Photo</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-xl p-4"
              />
            </div>

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

            {/* PASSWORD WITH SHOW/HIDE EYE */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="border p-4 rounded-xl w-full pr-12"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-900"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* CONFIRM PASSWORD WITH SHOW/HIDE EYE */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border p-4 rounded-xl w-full pr-12"
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-900"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="border p-4 rounded-xl"
              required
            />

            <div>
              <label className="block mb-2 font-semibold">Phone Number</label>

              <PhoneInput
                country={"ng"}
                enableSearch
                value={formData.phoneNumber}
                onChange={(phone) =>
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: "+" + phone,
                  }))
                }
                inputStyle={{
                  width: "100%",
                  height: "58px",
                  borderRadius: "12px",
                  fontSize: "16px",
                }}
              />
            </div>

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

            <div>
              <label className="block mb-2 font-semibold">Date of Birth</label>

              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="border p-4 rounded-xl w-full"
                required
              />
            </div>

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
              placeholder="Residential Address"
              value={formData.address}
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
