import { useState, type ReactNode } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const BecomeMember = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [photo, setPhoto] = useState<File | null>(null);
  const [signature, setSignature] = useState<File | null>(null);

  const initialForm = {
    fullName: "",
    gender: "",
    dateOfBirth: "",
    maritalStatus: "",
    occupation: "",

    phone: "",
    email: "",

    address: "",
    city: "",
    state: "",
    country: "",

    nextOfKin: "",
    nextOfKinPhone: "",

    reason: "",

    declarationAccepted: false,
    ndaAccepted: false,
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photo" | "signature",
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image.");
      return;
    }

    if (type === "photo") {
      setPhoto(file);
    } else {
      setSignature(file);
    }
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!photo) {
      setError("Please upload your passport photograph.");
      return;
    }

    if (!signature) {
      setError("Please upload your signature.");
      return;
    }

    if (!form.declarationAccepted) {
      setError("Please accept the declaration.");
      return;
    }

    if (!form.ndaAccepted) {
      setError("Please accept the confidentiality agreement.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      formData.append("passportPhoto", photo);
      formData.append("signature", signature);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(
          "Your membership application has been submitted successfully.",
        );

        setForm(initialForm);
        setPhoto(null);
        setSignature(null);
      } else {
        setError(data.message || "Application submission failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while submitting your application.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="min-h-screen bg-gray-100 py-16 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-[#4b0082] text-white px-10 py-12 text-center">
          <h1 className="text-5xl font-bold mb-4">Become a Member</h1>

          <p className="max-w-3xl mx-auto text-lg leading-8 text-gray-200">
            Thank you for your interest in joining the Confederation of Ogboni
            Aborigine Fraternity of Nigeria, Ogun State Chapter.
          </p>

          <p className="mt-6 text-yellow-300 font-semibold">
            Every application is carefully reviewed before membership approval.
          </p>
        </div>

        {success && (
          <div className="m-8 rounded-xl border border-green-400 bg-green-50 p-6 text-green-800">
            <h3 className="font-bold text-xl mb-2">
              Application Submitted Successfully
            </h3>

            <p>{success}</p>
          </div>
        )}

        {error && (
          <div className="m-8 rounded-xl border border-red-400 bg-red-50 p-6 text-red-800">
            <h3 className="font-bold text-xl mb-2">
              Unable to Submit Application
            </h3>

            <p>{error}</p>
          </div>
        )}

        <form onSubmit={submitApplication} className="p-10 space-y-10">
          <Section title="Personal Information">
            <Input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />

            <Select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              placeholder="Gender"
              options={["Male", "Female"]}
            />

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Date of Birth
              </label>

              <Input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            <Select
              name="maritalStatus"
              value={form.maritalStatus}
              onChange={handleChange}
              placeholder="Marital Status"
              options={["Single", "Married", "Divorced", "Widowed"]}
            />

            <Input
              name="occupation"
              placeholder="Occupation"
              value={form.occupation}
              onChange={handleChange}
              required
            />
          </Section>

          <Section title="Contact Information">
            <div className="flex flex-col">
              <label className="font-semibold mb-2">Phone Number</label>

              <PhoneInput
                country={"ng"}
                enableSearch
                value={form.phone}
                onChange={(phone) =>
                  setForm((prev) => ({
                    ...prev,
                    phone: "+" + phone,
                  }))
                }
                inputStyle={{
                  width: "100%",
                  height: "56px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                }}
                buttonStyle={{
                  borderTopLeftRadius: "12px",
                  borderBottomLeftRadius: "12px",
                }}
                searchStyle={{
                  width: "100%",
                }}
                placeholder="Enter phone number"
              />
            </div>

            <Select
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Select Country"
              options={[
                "Nigeria",
                "Ghana",
                "South Africa",
                "United Kingdom",
                "United States",
                "Canada",
                "Germany",
                "France",
                "Italy",
                "Spain",
                "United Arab Emirates",
                "Saudi Arabia",
                "Ireland",
                "Netherlands",
                "Australia",
                "New Zealand",
                "India",
                "Brazil",
                "Kenya",
                "Other",
              ]}
            />

            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <Input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              required
            />

            <Input
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              required
            />

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Residential Address"
              rows={3}
              required
              className="border rounded-xl p-4 w-full md:col-span-2"
            />
          </Section>
          <Section title="Next of Kin">
            <Input
              name="nextOfKin"
              placeholder="Next of Kin Full Name"
              value={form.nextOfKin}
              onChange={handleChange}
              required
            />

            <div className="flex flex-col">
              <label className="font-semibold mb-2">
                Next of Kin Phone Number
              </label>

              <PhoneInput
                country={"ng"}
                enableSearch
                value={form.nextOfKinPhone}
                onChange={(phone) =>
                  setForm((prev) => ({
                    ...prev,
                    nextOfKinPhone: "+" + phone,
                  }))
                }
                inputStyle={{
                  width: "100%",
                  height: "56px",
                  borderRadius: "12px",
                  border: "1px solid #d1d5db",
                  fontSize: "16px",
                }}
                buttonStyle={{
                  borderTopLeftRadius: "12px",
                  borderBottomLeftRadius: "12px",
                }}
                searchStyle={{
                  width: "100%",
                }}
                placeholder="Enter Next of Kin phone number"
              />
            </div>
          </Section>

          <Section title="Passport Photograph">
            <div className="md:col-span-2">
              <p className="text-gray-600 mb-3">
                Upload a clear passport photograph.
              </p>

              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleFile(e, "photo")}
                className="border rounded-xl p-3 w-full"
              />

              {photo && (
                <p className="mt-2 text-green-600 font-semibold">
                  Selected: {photo.name}
                </p>
              )}
            </div>
          </Section>

          <Section title="Signature">
            <div className="md:col-span-2">
              <p className="text-gray-600 mb-3">
                Upload your handwritten signature.
              </p>

              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleFile(e, "signature")}
                className="border rounded-xl p-3 w-full"
              />

              {signature && (
                <p className="mt-2 text-green-600 font-semibold">
                  Selected: {signature.name}
                </p>
              )}
            </div>
          </Section>

          <Section title="Reason For Joining">
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Explain why you wish to become a member."
              rows={6}
              required
              className="border rounded-xl p-4 w-full md:col-span-2"
            />
          </Section>
          {/* AGREEMENTS */}

          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-[#4b0082]">
              Declaration & Confidentiality Agreement
            </h2>

            <p className="text-gray-700 leading-7">
              Please read and accept the following agreements before submitting
              your application.
            </p>

            <label className="flex items-start gap-4">
              <input
                type="checkbox"
                name="declarationAccepted"
                checked={form.declarationAccepted}
                onChange={handleCheckbox}
                className="mt-2 w-5 h-5"
              />

              <span className="leading-7 text-gray-700">
                <strong>Declaration</strong>
                <br />I declare that the information provided in this
                application is true and correct to the best of my knowledge and
                I voluntarily agree to uphold the values and dignity of the
                fraternity.
              </span>
            </label>

            <label className="flex items-start gap-4">
              <input
                type="checkbox"
                name="ndaAccepted"
                checked={form.ndaAccepted}
                onChange={handleCheckbox}
                className="mt-2 w-5 h-5"
              />

              <span className="leading-7 text-gray-700">
                <strong>Confidentiality Agreement</strong>
                <br />I agree that every confidential knowledge, teachings,
                ceremonies, discussions and activities of the fraternity shall
                remain private and shall never be disclosed to non-members.
              </span>
            </label>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6">
            <p className="text-gray-700 leading-8">
              Submission of this application does not automatically guarantee
              membership. Every application will be reviewed carefully by the
              Membership Committee. Successful applicants will be contacted
              through the details provided.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4b0082] hover:bg-[#360061] text-white py-5 rounded-xl text-xl font-bold transition disabled:opacity-50"
          >
            {loading
              ? "Submitting Application..."
              : "Submit Membership Application"}
          </button>
        </form>
      </div>
    </section>
  );
};

// ============================
// REUSABLE COMPONENTS
// ============================

interface SectionProps {
  title: string;
  children: ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <div>
    <h2 className="text-2xl font-bold text-[#4b0082] mb-6 border-b pb-3">
      {title}
    </h2>

    <div className="grid md:grid-cols-2 gap-6">{children}</div>
  </div>
);

interface InputProps {
  name: string;
  value: string;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

const Input = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: InputProps) => (
  <input
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    type={type}
    required={required}
    className="border rounded-xl p-4 w-full"
  />
);

interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
}

const Select = ({
  name,
  value,
  onChange,
  options,
  placeholder,
}: SelectProps) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="border rounded-xl p-4 w-full"
  >
    <option value="">{placeholder}</option>

    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

export default BecomeMember;
