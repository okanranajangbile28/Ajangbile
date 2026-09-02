import { useCallback, useEffect, useState, type ReactNode } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PricingResponse {
  success: boolean;
  pricing?: {
    applicationFee: number;
    currency: "USD";
  };
  message?: string;
}

const countries = [
  "Nigeria",
  "Ghana",
  "United Kingdom",
  "United States",
  "Canada",
  "South Africa",
  "Kenya",
  "Other",
];

const BecomeMember = () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const [applicationFee, setApplicationFee] = useState<number | null>(null);
  const [pricingLoading, setPricingLoading] = useState(true);

  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    occupation: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    country: "Nigeria",
    nextOfKin: "",
    reason: "",
    previousFraternity: "",
  });

  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);
  const [signature, setSignature] = useState<File | null>(null);

  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<
    "stripe" | "bank_transfer"
  >("stripe");

  const [bankTransferReceipt, setBankTransferReceipt] = useState<File | null>(
    null,
  );

  const [bankTransferSubmitting, setBankTransferSubmitting] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePassportPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setPassportPhoto(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Passport photo must be JPG, PNG, or WEBP.");
      e.target.value = "";
      setPassportPhoto(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Passport photo must not exceed 10MB.");
      e.target.value = "";
      setPassportPhoto(null);
      return;
    }

    setError("");
    setPassportPhoto(file);
  };

  const handleSignature = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setSignature(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Signature must be JPG, PNG, or WEBP.");
      e.target.value = "";
      setSignature(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Signature must not exceed 10MB.");
      e.target.value = "";
      setSignature(null);
      return;
    }

    setError("");
    setSignature(file);
  };

  const handleBankTransferReceipt = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setBankTransferReceipt(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Payment receipt must be JPG, PNG, WEBP, or PDF.");
      e.target.value = "";
      setBankTransferReceipt(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Payment receipt must not exceed 10MB.");
      e.target.value = "";
      setBankTransferReceipt(null);
      return;
    }

    setError("");
    setBankTransferReceipt(file);
  };

  const submitApplication = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!serverUrl) {
      setError("Payment server is not configured.");
      return;
    }

    if (applicationFee === null) {
      setError(
        "The current application fee could not be loaded. Please refresh the page and try again.",
      );
      return;
    }

    if (!passportPhoto) {
      setError("Please upload your passport photograph.");
      return;
    }

    if (!signature) {
      setError("Please upload your signature.");
      return;
    }

    if (!declarationAccepted) {
      setError("Please accept the declaration before continuing.");
      return;
    }

    if (!ndaAccepted) {
      setError(
        "Please accept the confidentiality and NDA agreement before continuing.",
      );
      return;
    }

    if (paymentMethod === "bank_transfer" && !bankTransferReceipt) {
      setError("Please upload your bank transfer payment receipt.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("fullName", form.fullName);
      formData.append("gender", form.gender);
      formData.append("dateOfBirth", form.dateOfBirth);
      formData.append("occupation", form.occupation);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("address", form.address);
      formData.append("state", form.state);
      formData.append("country", form.country);
      formData.append("nextOfKin", form.nextOfKin);
      formData.append("reason", form.reason);
      formData.append("previousFraternity", form.previousFraternity);

      formData.append("applicationFeeAmount", String(applicationFee));

      formData.append("applicationFeePaymentMethod", paymentMethod);

      formData.append("passportPhoto", passportPhoto);
      formData.append("signature", signature);

      formData.append("declarationAccepted", String(declarationAccepted));

      formData.append("ndaAccepted", String(ndaAccepted));

      const response = await fetch(`${serverUrl}/api/membership-applications`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit your membership application.",
        );
      }

      const applicationId = data.application?._id || data.applicationId;

      if (!applicationId) {
        throw new Error(
          "Your application was created, but the application ID was not returned.",
        );
      }

      if (paymentMethod === "stripe") {
        window.location.href = `${serverUrl}/api/payments/application-fee?applicationId=${applicationId}`;

        return;
      }

      const transferFormData = new FormData();

      transferFormData.append("applicationId", applicationId);

      transferFormData.append(
        "applicationFeeReceipt",
        bankTransferReceipt as File,
      );

      setBankTransferSubmitting(true);

      const transferResponse = await fetch(
        `${serverUrl}/api/membership-applications/application-fee/bank-transfer`,
        {
          method: "POST",
          body: transferFormData,
        },
      );

      const transferData = await transferResponse.json();

      if (!transferResponse.ok || !transferData.success) {
        throw new Error(
          transferData.message ||
            "Unable to submit your bank transfer receipt.",
        );
      }

      window.location.href =
        transferData.redirectUrl || "/bank-transfer-success";
    } catch (err) {
      console.error("❌ Membership application submission error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
      setBankTransferSubmitting(false);
    }
  };

  const displayApplicationFee =
    applicationFee !== null
      ? `$${applicationFee.toFixed(2)}`
      : pricingLoading
        ? "Loading..."
        : "Unavailable";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="bg-[#4b0082] px-6 py-8 text-center text-white">
            <h1 className="text-3xl font-bold">Become a Member</h1>

            <p className="mt-2 text-sm text-purple-100">
              Membership Application – Ajangbile Heritage
            </p>
          </div>

          <form onSubmit={submitApplication} className="space-y-8 p-6 md:p-10">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                <p className="font-semibold">Unable to Continue</p>

                <p className="mt-1 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
                <p className="font-semibold">
                  Application Submitted Successfully
                </p>

                <p className="mt-1 text-sm">
                  Your application has been received.
                </p>
              </div>
            )}

            <Section title="Personal Information">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Full Name" required>
                  <Input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </Field>

                <Field label="Gender" required>
                  <Select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select gender</option>

                    <option value="Male">Male</option>

                    <option value="Female">Female</option>
                  </Select>
                </Field>

                <Field label="Date of Birth" required>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </Field>

                <Field label="Occupation" required>
                  <Input
                    name="occupation"
                    value={form.occupation}
                    onChange={handleChange}
                    placeholder="Enter your occupation"
                    required
                  />
                </Field>

                <Field label="Phone Number" required>
                  <PhoneInput
                    country="ng"
                    value={form.phone}
                    onChange={(value) =>
                      setForm((previous) => ({
                        ...previous,
                        phone: value,
                      }))
                    }
                    enableSearch
                    inputClass="!h-[42px] !w-full !rounded-lg"
                    containerClass="!w-full"
                    buttonClass="!rounded-l-lg"
                  />
                </Field>

                <Field label="Email Address" required>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </Field>
              </div>
            </Section>

            <Section title="Address Information">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Address" required>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                    rows={3}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#4b0082] focus:ring-2 focus:ring-purple-100"
                  />
                </Field>

                <Field label="State" required>
                  <Input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    required
                  />
                </Field>

                <Field label="Country" required>
                  <Select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Next of Kin" required>
                  <Input
                    name="nextOfKin"
                    value={form.nextOfKin}
                    onChange={handleChange}
                    placeholder="Enter next of kin"
                    required
                  />
                </Field>
              </div>
            </Section>

            <Section title="Membership Information">
              <div className="space-y-5">
                <Field label="Why do you want to become a member?" required>
                  <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    placeholder="Tell us why you want to become a member"
                    rows={5}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#4b0082] focus:ring-2 focus:ring-purple-100"
                  />
                </Field>

                <Field label="Have you previously belonged to another fraternity or organisation?">
                  <textarea
                    name="previousFraternity"
                    value={form.previousFraternity}
                    onChange={handleChange}
                    placeholder="If applicable, provide details"
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#4b0082] focus:ring-2 focus:ring-purple-100"
                  />
                </Field>
              </div>
            </Section>

            <Section title="Required Documents">
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Passport Photograph" required>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePassportPhoto}
                    required
                    className="block w-full rounded-lg border border-gray-300 p-3 text-sm"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    JPG, PNG, or WEBP. Maximum 10MB.
                  </p>

                  {passportPhoto && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected: {passportPhoto.name}
                    </p>
                  )}
                </Field>

                <Field label="Signature" required>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleSignature}
                    required
                    className="block w-full rounded-lg border border-gray-300 p-3 text-sm"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    JPG, PNG, or WEBP. Maximum 10MB.
                  </p>

                  {signature && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected: {signature.name}
                    </p>
                  )}
                </Field>
              </div>
            </Section>

            <Section title="Declaration & Agreement">
              <div className="space-y-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={declarationAccepted}
                    onChange={(e) => setDeclarationAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4"
                  />

                  <span className="text-sm text-gray-700">
                    I declare that the information provided in this application
                    is true and accurate to the best of my knowledge.
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={ndaAccepted}
                    onChange={(e) => setNdaAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4"
                  />

                  <span className="text-sm text-gray-700">
                    I agree to maintain the confidentiality of the
                    organisation's information and accept the applicable
                    confidentiality and NDA requirements.
                  </span>
                </label>
              </div>
            </Section>

            <Section title="Application Fee">
              <div className="rounded-xl border border-purple-200 bg-purple-50 p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Current Application Fee
                    </p>

                    <p className="mt-1 text-3xl font-bold text-[#4b0082]">
                      {displayApplicationFee}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                    USD
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="mb-3 text-sm font-semibold text-gray-800">
                    Choose Payment Method
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label
                      className={`cursor-pointer rounded-xl border p-5 transition ${
                        paymentMethod === "stripe"
                          ? "border-[#4b0082] bg-purple-50"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="stripe"
                          checked={paymentMethod === "stripe"}
                          onChange={() => setPaymentMethod("stripe")}
                          className="mt-1"
                        />

                        <div>
                          <p className="font-semibold text-gray-900">
                            Pay Online with Stripe
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            Pay securely online using your debit or credit card.
                          </p>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`cursor-pointer rounded-xl border p-5 transition ${
                        paymentMethod === "bank_transfer"
                          ? "border-[#4b0082] bg-purple-50"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank_transfer"
                          checked={paymentMethod === "bank_transfer"}
                          onChange={() => setPaymentMethod("bank_transfer")}
                          className="mt-1"
                        />

                        <div>
                          <p className="font-semibold text-gray-900">
                            Pay by Bank Transfer
                          </p>

                          <p className="mt-1 text-sm text-gray-600">
                            Transfer the application fee and upload your payment
                            receipt.
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {paymentMethod === "stripe" && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <p className="font-semibold text-gray-900">
                      Pay Online with Stripe
                    </p>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      After submitting your application, you will be redirected
                      to Stripe's secure payment page to complete your
                      application fee payment.
                    </p>

                    <p className="mt-3 font-semibold text-[#4b0082]">
                      Amount: {displayApplicationFee}
                    </p>
                  </div>
                )}

                {paymentMethod === "bank_transfer" && (
                  <div className="space-y-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Pay by Bank Transfer
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        Transfer the {displayApplicationFee} application fee to
                        the account below and upload the payment receipt.
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Bank
                          </p>

                          <p className="mt-1 font-semibold text-gray-900">
                            Zenith Bank
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Account Name
                          </p>

                          <p className="mt-1 font-semibold text-gray-900">
                            ARUN-UN-TAN LIMITED
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Account Number
                          </p>

                          <p className="mt-1 font-semibold text-gray-900">
                            1229796653
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Amount
                          </p>

                          <p className="mt-1 text-xl font-bold text-[#4b0082]">
                            {displayApplicationFee}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
                      <p className="text-sm font-medium leading-6 text-yellow-900">
                        Please send the current Naira equivalent of the USD
                        amount shown above. Exchange rates may change, so
                        confirm the current equivalent before making your
                        transfer.
                      </p>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <p className="text-sm leading-6 text-blue-900">
                        After completing the transfer, upload your payment
                        receipt. Your payment will be manually verified by the
                        Membership Committee.
                      </p>
                    </div>

                    <Field label="Payment Receipt" required>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={handleBankTransferReceipt}
                        required
                        className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm"
                      />

                      <p className="mt-2 text-xs text-gray-500">
                        JPG, PNG, WEBP, or PDF. Maximum 10MB.
                      </p>

                      {bankTransferReceipt && (
                        <p className="mt-2 text-sm text-green-600">
                          Selected: {bankTransferReceipt.name}
                        </p>
                      )}
                    </Field>
                  </div>
                )}
              </div>
            </Section>

            <div className="border-t border-gray-200 pt-6">
              <button
                type="submit"
                disabled={
                  submitting ||
                  bankTransferSubmitting ||
                  pricingLoading ||
                  applicationFee === null
                }
                className="w-full rounded-xl bg-[#4b0082] px-6 py-4 text-base font-bold text-white transition hover:bg-purple-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paymentMethod === "stripe"
                  ? submitting
                    ? "Preparing Secure Payment..."
                    : "Continue to Stripe"
                  : bankTransferSubmitting
                    ? "Submitting Transfer & Receipt..."
                    : "Pay with Transfer"}
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                By submitting this application, you confirm that the information
                provided is accurate.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface SectionProps {
  title: string;
  children: ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
  return (
    <section>
      <div className="mb-5 border-b border-gray-200 pb-3">
        <h2 className="text-xl font-bold text-[#4b0082]">{title}</h2>
      </div>

      {children}
    </section>
  );
};

interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

const Field = ({ label, required = false, children }: FieldProps) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
};

const Input = ({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#4b0082] focus:ring-2 focus:ring-purple-100 ${className}`}
    />
  );
};

const Select = ({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
}) => {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#4b0082] focus:ring-2 focus:ring-purple-100 ${className}`}
    >
      {children}
    </select>
  );
};

export default BecomeMember;
