import { useCallback, useEffect, useState, type ReactNode } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Democratic Republic of the Congo",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

interface PricingResponse {
  success: boolean;
  pricing?: {
    applicationFee: number;
    currency: "USD";
  };
  message?: string;
}

interface FormState {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  occupation: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  nextOfKin: string;
  nextOfKinPhone: string;
  reason: string;
  declarationAccepted: boolean;
  ndaAccepted: boolean;
}

const initialForm: FormState = {
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

const BecomeMember = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // CENTRAL PRICING
  // ======================================================

  const [applicationFee, setApplicationFee] = useState<number | null>(null);
  const [pricingLoading, setPricingLoading] = useState(true);

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const loadPricing = useCallback(async () => {
    try {
      setPricingLoading(true);
      setError("");

      if (!serverUrl) {
        throw new Error("Payment server is not configured.");
      }

      const response = await fetch(`${serverUrl}/api/pricing`);
      const data: PricingResponse = await response.json();

      if (!response.ok || !data.success || !data.pricing) {
        throw new Error(
          data.message || "Unable to load the current application fee.",
        );
      }

      setApplicationFee(data.pricing.applicationFee);
    } catch (err) {
      console.error("❌ Load membership pricing error:", err);

      setApplicationFee(null);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load the current application fee.",
      );
    } finally {
      setPricingLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    void loadPricing();
  }, [loadPricing]);

  // ======================================================
  // APPLICATION FILES
  // ======================================================

  const [photo, setPhoto] = useState<File | null>(null);
  const [signature, setSignature] = useState<File | null>(null);

  // ======================================================
  // APPLICATION PAYMENT
  // ======================================================

  const [paymentMethod, setPaymentMethod] = useState<
    "stripe" | "bank_transfer"
  >("stripe");

  const [bankTransferReference, setBankTransferReference] = useState("");
  const [bankTransferReceipt, setBankTransferReceipt] = useState<File | null>(
    null,
  );

  const [bankTransferSubmitting, setBankTransferSubmitting] = useState(false);

  // ======================================================
  // FORM
  // ======================================================

  const [form, setForm] = useState<FormState>(initialForm);

  // ======================================================
  // HANDLE INPUT
  // ======================================================

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

  // ======================================================
  // HANDLE CHECKBOX
  // ======================================================

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  // ======================================================
  // HANDLE APPLICATION FILES
  // ======================================================

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photo" | "signature",
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("The uploaded image must be smaller than 10MB.");
      e.target.value = "";
      return;
    }

    if (type === "photo") {
      setPhoto(file);
    } else {
      setSignature(file);
    }

    setError("");
  };

  // ======================================================
  // HANDLE BANK TRANSFER RECEIPT
  // ======================================================

  const handleBankTransferReceipt = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload your payment receipt as a JPG, PNG, WEBP image or PDF.",
      );

      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Payment receipt must be smaller than 10MB.");

      e.target.value = "";
      return;
    }

    setBankTransferReceipt(file);
    setError("");
  };

  // ======================================================
  // SUBMIT APPLICATION
  // ======================================================

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    // ====================================================
    // SERVER CONFIGURATION
    // ====================================================

    if (!serverUrl) {
      setError("Payment server is not configured.");
      return;
    }

    // ====================================================
    // PRICING VALIDATION
    // ====================================================

    if (pricingLoading || applicationFee === null) {
      setError(
        "The current application fee is still loading. Please wait a moment and try again.",
      );
      return;
    }

    // ====================================================
    // BASIC VALIDATION
    // ====================================================

    if (!form.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.gender) {
      setError("Please select your gender.");
      return;
    }

    if (!form.dateOfBirth) {
      setError("Please enter your date of birth.");
      return;
    }

    if (!form.maritalStatus) {
      setError("Please select your marital status.");
      return;
    }

    if (!form.occupation.trim()) {
      setError("Please enter your occupation.");
      return;
    }

    if (!form.phone.trim() || form.phone === "+") {
      setError("Please enter your phone number.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.country) {
      setError("Please select your country.");
      return;
    }

    if (!form.city.trim()) {
      setError("Please enter your city.");
      return;
    }

    if (!form.state.trim()) {
      setError("Please enter your state.");
      return;
    }

    if (!form.address.trim()) {
      setError("Please enter your residential address.");
      return;
    }

    if (!form.nextOfKin.trim()) {
      setError("Please enter your next of kin full name.");
      return;
    }

    if (!form.nextOfKinPhone.trim() || form.nextOfKinPhone === "+") {
      setError("Please enter your next of kin phone number.");
      return;
    }

    if (!form.reason.trim()) {
      setError("Please explain why you wish to become a member.");
      return;
    }

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

    // ====================================================
    // BANK TRANSFER VALIDATION
    // ====================================================

    if (paymentMethod === "bank_transfer") {
      if (!bankTransferReference.trim()) {
        setError("Please enter your bank transfer reference.");
        return;
      }

      if (!bankTransferReceipt) {
        setError("Please upload your bank transfer payment receipt.");
        return;
      }
    }

    try {
      setLoading(true);

      // ==================================================
      // CREATE APPLICATION FORMDATA
      // ==================================================

      const formData = new FormData();

      formData.append("fullName", form.fullName.trim());
      formData.append("gender", form.gender);
      formData.append("dateOfBirth", form.dateOfBirth);
      formData.append("maritalStatus", form.maritalStatus);
      formData.append("occupation", form.occupation.trim());

      formData.append("phone", form.phone);
      formData.append("email", form.email.trim());

      formData.append("address", form.address.trim());
      formData.append("city", form.city.trim());
      formData.append("state", form.state.trim());
      formData.append("country", form.country);

      formData.append("nextOfKin", form.nextOfKin.trim());
      formData.append("nextOfKinPhone", form.nextOfKinPhone);

      formData.append("reason", form.reason.trim());

      formData.append("declarationAccepted", String(form.declarationAccepted));

      formData.append("ndaAccepted", String(form.ndaAccepted));

      formData.append("passportPhoto", photo);
      formData.append("signature", signature);

      // ==================================================
      // CREATE APPLICATION
      // ==================================================

      const response = await fetch(`${serverUrl}/api/membership-applications`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Unable to create your membership application.",
        );

        setLoading(false);
        return;
      }

      // ==================================================
      // GET APPLICATION ID
      // ==================================================

      const applicationId = data.application?._id || data.applicationId;

      if (!applicationId) {
        console.error("Application ID missing:", data);

        setError(
          "Your application was created, but we could not continue with payment.",
        );

        setLoading(false);
        return;
      }

      // ==================================================
      // STRIPE PAYMENT
      // ==================================================

      if (paymentMethod === "stripe") {
        window.location.href =
          `${serverUrl}/api/payments/application-fee` +
          `?applicationId=${encodeURIComponent(applicationId)}`;

        return;
      }

      // ==================================================
      // BANK TRANSFER PAYMENT
      // ==================================================

      try {
        setBankTransferSubmitting(true);

        const transferFormData = new FormData();

        transferFormData.append("applicationId", applicationId);
        transferFormData.append("reference", bankTransferReference.trim());

        if (!bankTransferReceipt) {
          setError("Please upload your bank transfer payment receipt.");
          setBankTransferSubmitting(false);
          setLoading(false);
          return;
        }

        transferFormData.append("applicationFeeReceipt", bankTransferReceipt);

        const transferResponse = await fetch(
          `${serverUrl}/api/membership-applications/application-fee/bank-transfer`,
          {
            method: "POST",
            body: transferFormData,
          },
        );

        const transferData = await transferResponse.json();

        if (!transferResponse.ok || !transferData.success) {
          setError(
            transferData.message ||
              "Unable to submit your bank transfer details.",
          );

          setBankTransferSubmitting(false);
          setLoading(false);
          return;
        }

        // ==================================================
        // SUCCESS
        // ==================================================

        alert(
          "Your application has been submitted successfully. Your bank transfer receipt is now awaiting verification by the Membership Committee.",
        );

        setForm(initialForm);

        setPhoto(null);
        setSignature(null);

        setBankTransferReference("");
        setBankTransferReceipt(null);

        setPaymentMethod("stripe");

        setBankTransferSubmitting(false);
        setLoading(false);
      } catch (err) {
        console.error("Bank transfer submission error:", err);

        setError(
          "Your application was created, but we could not submit the bank transfer details. Please contact support.",
        );

        setBankTransferSubmitting(false);
        setLoading(false);
      }
    } catch (err) {
      console.error("Membership application error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating your application. Please try again.",
      );

      setLoading(false);
    }
  };

  // ======================================================
  // DISPLAY PRICE
  // ======================================================

  const displayApplicationFee =
    applicationFee !== null
      ? `$${applicationFee.toFixed(2)}`
      : pricingLoading
        ? "Loading..."
        : "Unavailable";

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <section className="min-h-screen bg-gray-100 py-16 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* ==================================================
            HEADER
        ================================================== */}

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

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (
          <div className="m-8 rounded-xl border border-red-400 bg-red-50 p-6 text-red-800">
            <h3 className="font-bold text-xl mb-2">Unable to Continue</h3>

            <p>{error}</p>

            {applicationFee === null && !pricingLoading && (
              <button
                type="button"
                onClick={() => void loadPricing()}
                className="mt-4 rounded-lg bg-[#4b0082] px-5 py-2 text-white font-semibold hover:bg-[#360061]"
              >
                Retry Loading Price
              </button>
            )}
          </div>
        )}

        {/* ==================================================
            APPLICATION FORM
        ================================================== */}

        <form onSubmit={submitApplication} className="p-10 space-y-10">
          {/* ==================================================
              PERSONAL INFORMATION
          ================================================== */}

          <Section title="Personal Information">
            <Field label="Full Name">
              <Input
                name="fullName"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Gender">
              <Select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                placeholder="Select Gender"
                options={["Male", "Female"]}
              />
            </Field>

            <Field label="Date of Birth">
              <Input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Marital Status">
              <Select
                name="maritalStatus"
                value={form.maritalStatus}
                onChange={handleChange}
                placeholder="Select Marital Status"
                options={["Single", "Married", "Divorced", "Widowed"]}
              />
            </Field>

            <Field label="Occupation">
              <Input
                name="occupation"
                placeholder="Enter your occupation"
                value={form.occupation}
                onChange={handleChange}
                required
              />
            </Field>
          </Section>

          {/* ==================================================
              CONTACT INFORMATION
          ================================================== */}

          <Section title="Contact Information">
            <Field label="Phone Number">
              <PhoneInput
                country="ng"
                enableSearch
                value={form.phone}
                onChange={(phone) =>
                  setForm((prev) => ({
                    ...prev,
                    phone: phone ? `+${phone}` : "",
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
            </Field>

            <Field label="Email Address">
              <Input
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Country">
              <Select
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Select Country"
                options={countries}
              />
            </Field>

            <Field label="City">
              <Input
                name="city"
                placeholder="Enter your city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="State">
              <Input
                name="state"
                placeholder="Enter your state"
                value={form.state}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Residential Address" className="md:col-span-2">
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your full residential address"
                rows={3}
                required
                className="border rounded-xl p-4 w-full"
              />
            </Field>
          </Section>

          {/* ==================================================
              NEXT OF KIN
          ================================================== */}

          <Section title="Next of Kin">
            <Field label="Next of Kin Full Name">
              <Input
                name="nextOfKin"
                placeholder="Enter next of kin full name"
                value={form.nextOfKin}
                onChange={handleChange}
                required
              />
            </Field>

            <Field label="Next of Kin Phone Number">
              <PhoneInput
                country="ng"
                enableSearch
                value={form.nextOfKinPhone}
                onChange={(phone) =>
                  setForm((prev) => ({
                    ...prev,
                    nextOfKinPhone: phone ? `+${phone}` : "",
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
                placeholder="Enter next of kin phone number"
              />
            </Field>
          </Section>

          {/* ==================================================
              PASSPORT PHOTO
          ================================================== */}

          <Section title="Passport Photograph">
            <Field label="Passport Photograph" className="md:col-span-2">
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
            </Field>
          </Section>

          {/* ==================================================
              SIGNATURE
          ================================================== */}

          <Section title="Signature">
            <Field label="Handwritten Signature" className="md:col-span-2">
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
            </Field>
          </Section>

          {/* ==================================================
              REASON FOR JOINING
          ================================================== */}

          <Section title="Reason For Joining">
            <Field
              label="Why do you wish to become a member?"
              className="md:col-span-2"
            >
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Explain why you wish to become a member."
                rows={6}
                required
                className="border rounded-xl p-4 w-full"
              />
            </Field>
          </Section>

          {/* ==================================================
              AGREEMENTS
          ================================================== */}

          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 space-y-6">
            <h2 className="text-2xl font-bold text-[#4b0082]">
              Declaration & Confidentiality Agreement
            </h2>

            <p className="text-gray-700 leading-7">
              Please read and accept the following agreements before continuing
              to payment.
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

          {/* ==================================================
              APPLICATION FEE
          ================================================== */}

          <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Application Processing Fee
            </h2>

            <p className="text-gray-700 leading-7">
              A non-refundable application processing fee of{" "}
              <strong>{displayApplicationFee}</strong> is required to complete
              your membership application.
            </p>

            <p className="mt-3 text-gray-700 leading-7">
              Please select your preferred payment method below.
            </p>
          </div>

          {/* ==================================================
              PAYMENT METHOD
          ================================================== */}

          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-[#4b0082]">
              Choose Payment Method
            </h2>

            {/* ==================================================
                STRIPE
            ================================================== */}

            <label
              className={`block cursor-pointer rounded-2xl border-2 p-6 transition ${
                paymentMethod === "stripe"
                  ? "border-[#4b0082] bg-purple-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                  className="mt-1 w-5 h-5"
                />

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Pay Online with Stripe
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Securely pay the {displayApplicationFee} application
                    processing fee using your debit or credit card.
                  </p>
                </div>
              </div>
            </label>

            {/* ==================================================
                BANK TRANSFER
            ================================================== */}

            <label
              className={`block cursor-pointer rounded-2xl border-2 p-6 transition ${
                paymentMethod === "bank_transfer"
                  ? "border-[#4b0082] bg-purple-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                  className="mt-1 w-5 h-5"
                />

                <div className="w-full">
                  <h3 className="text-lg font-bold text-gray-900">
                    Pay by Bank Transfer
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Transfer the {displayApplicationFee} application fee to the
                    account below and upload your payment receipt.
                  </p>

                  {paymentMethod === "bank_transfer" && (
                    <div className="mt-5 rounded-xl border border-purple-200 bg-white p-5">
                      <h4 className="text-lg font-bold text-[#4b0082] mb-4">
                        Bank Transfer Details
                      </h4>

                      <div className="space-y-3 text-gray-800">
                        <div>
                          <span className="font-semibold">Bank:</span> Zenith
                          Bank
                        </div>

                        <div>
                          <span className="font-semibold">Account Name:</span>{" "}
                          ARUN-UN-TAN LIMITED
                        </div>

                        <div>
                          <span className="font-semibold">Account Number:</span>{" "}
                          1229796653
                        </div>

                        <div>
                          <span className="font-semibold">Amount:</span>{" "}
                          {displayApplicationFee}
                        </div>
                      </div>

                      {/* ==================================================
                          TRANSFER NOTICE
                      ================================================== */}

                      <div className="mt-5 rounded-lg bg-yellow-50 border border-yellow-300 p-4">
                        <p className="text-sm text-gray-700 leading-6">
                          After completing the transfer, enter your transfer
                          reference and upload the payment receipt. Your payment
                          will be manually verified by the Membership Committee.
                        </p>
                      </div>

                      {/* ==================================================
                          TRANSFER REFERENCE
                      ================================================== */}

                      <div className="mt-5">
                        <label className="block mb-2 font-semibold text-gray-700">
                          Bank Transfer Reference
                        </label>

                        <input
                          type="text"
                          value={bankTransferReference}
                          onChange={(e) =>
                            setBankTransferReference(e.target.value)
                          }
                          placeholder="Enter your transfer reference"
                          className="border rounded-xl p-4 w-full"
                        />
                      </div>

                      {/* ==================================================
                          RECEIPT UPLOAD
                      ================================================== */}

                      <div className="mt-6">
                        <label className="block mb-2 font-semibold text-gray-700">
                          Payment Receipt
                        </label>

                        <p className="text-sm text-gray-600 mb-3">
                          Upload a screenshot, image or PDF showing your{" "}
                          {displayApplicationFee} bank transfer.
                        </p>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          onChange={handleBankTransferReceipt}
                          className="border rounded-xl p-3 w-full bg-white"
                        />

                        {bankTransferReceipt && (
                          <div className="mt-3 rounded-lg border border-green-300 bg-green-50 p-4">
                            <p className="text-green-700 font-semibold">
                              ✓ Receipt selected
                            </p>

                            <p className="text-sm text-green-700 mt-1 break-all">
                              {bankTransferReceipt.name}
                            </p>

                            <p className="text-xs text-green-600 mt-1">
                              {(bankTransferReceipt.size / 1024 / 1024).toFixed(
                                2,
                              )}{" "}
                              MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </label>
          </div>

          {/* ==================================================
              FINAL NOTICE
          ================================================== */}

          <div className="bg-gray-50 border-l-4 border-[#4b0082] rounded-xl p-6">
            <p className="text-gray-700 leading-8">
              Payment of the application processing fee does not guarantee
              membership. Every application will be reviewed carefully by the
              Membership Committee. Successful applicants will be contacted
              through the details provided.
            </p>
          </div>

          {/* ==================================================
              SUBMIT BUTTON
          ================================================== */}

          <button
            type="submit"
            disabled={
              loading ||
              bankTransferSubmitting ||
              pricingLoading ||
              applicationFee === null
            }
            className="w-full bg-[#4b0082] hover:bg-[#360061] text-white py-5 rounded-xl text-xl font-bold transition disabled:opacity-50"
          >
            {pricingLoading
              ? "Loading Application Fee..."
              : applicationFee === null
                ? "Application Fee Unavailable"
                : paymentMethod === "stripe"
                  ? loading
                    ? "Preparing Secure Payment..."
                    : `Continue to $${applicationFee.toFixed(2)} Application Payment`
                  : bankTransferSubmitting
                    ? "Submitting Transfer & Receipt..."
                    : "Submit Bank Transfer & Receipt"}
          </button>
        </form>
      </div>
    </section>
  );
};

// ======================================================
// REUSABLE COMPONENTS
// ======================================================

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

interface FieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

const Field = ({ label, children, className = "" }: FieldProps) => (
  <div className={`flex flex-col ${className}`}>
    <label className="block mb-2 font-semibold text-gray-700">{label}</label>

    {children}
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
    required
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
