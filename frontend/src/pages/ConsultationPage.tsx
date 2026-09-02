import { useCallback, useEffect, useState } from "react";
import {
  CreditCard,
  Landmark,
  MessageCircle,
  CheckCircle,
  ShieldCheck,
  Upload,
} from "lucide-react";

const services = [
  {
    title: "Ifa Consultation",
    description:
      "Receive spiritual guidance and divine insights through authentic Ifa consultation.",
  },
  {
    title: "Dream Interpretation",
    description:
      "Understand the spiritual meaning behind your dreams and visions.",
  },
  {
    title: "Spiritual Cleansing",
    description:
      "Remove negative energies and restore spiritual balance and protection.",
  },
  {
    title: "Ancestral Guidance",
    description:
      "Seek wisdom and direction from ancestral traditions and sacred teachings.",
  },
  {
    title: "Marriage & Family Guidance",
    description:
      "Receive spiritual counsel concerning marriage, relationships and family matters.",
  },
  {
    title: "Business & Career Consultation",
    description:
      "Gain divine guidance concerning business decisions, career growth and prosperity.",
  },
];

const consultationDetails = [
  {
    type: "Opele" as const,
    name: "Opele Consultation",
    description:
      "A traditional Opele consultation for spiritual guidance, clarity and insight.",
  },
  {
    type: "Ikin" as const,
    name: "Ikin Consultation",
    description:
      "A deeper Ikin consultation for those seeking comprehensive spiritual guidance.",
  },
  {
    type: "OneHour" as const,
    name: "1-Hour Consultation & Discussion",
    description:
      "A private one-hour consultation and discussion for detailed spiritual guidance, questions and personal matters.",
  },
];

type ConsultationType = (typeof consultationDetails)[number]["type"];

interface PricingResponse {
  success: boolean;
  pricing: {
    opeleConsultation: number;
    ikinConsultation: number;
    oneHourConsultation: number;
    currency: "USD";
  };
}

interface ConsultationOption {
  type: ConsultationType;
  name: string;
  amount: number;
  description: string;
}

const ConsultationPage = () => {
  const [consultations, setConsultations] = useState<ConsultationOption[]>([]);

  const [selectedConsultation, setSelectedConsultation] =
    useState<ConsultationType | null>(null);

  const [showBankDetails, setShowBankDetails] = useState(false);
  const [bankTransferReceipt, setBankTransferReceipt] = useState<File | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ======================================================
  // LOAD CENTRAL PRICING
  // ======================================================

  const loadPricing = useCallback(async () => {
    try {
      setPricingLoading(true);
      setMessage("");

      const serverUrl = import.meta.env.VITE_SERVER_URL;

      if (!serverUrl) {
        setMessage("Payment server is not configured.");
        return;
      }

      const response = await fetch(`${serverUrl}/api/pricing`);

      const data: PricingResponse = await response.json();

      if (!response.ok || !data.success || !data.pricing) {
        throw new Error(
          data?.pricing
            ? "Unable to load consultation pricing."
            : "Unable to load current consultation pricing.",
        );
      }

      const pricing = data.pricing;

      setConsultations([
        {
          ...consultationDetails[0],
          amount: pricing.opeleConsultation,
        },
        {
          ...consultationDetails[1],
          amount: pricing.ikinConsultation,
        },
        {
          ...consultationDetails[2],
          amount: pricing.oneHourConsultation,
        },
      ]);
    } catch (error) {
      console.error("❌ Load consultation pricing error:", error);

      setConsultations([]);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load current consultation pricing.",
      );
    } finally {
      setPricingLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPricing();
  }, [loadPricing]);

  // ======================================================
  // SELECT CONSULTATION
  // ======================================================

  const handleSelectConsultation = (type: ConsultationType) => {
    setSelectedConsultation(type);
    setShowBankDetails(false);
    setBankTransferReceipt(null);
    setMessage("");
  };

  // ======================================================
  // STRIPE PAYMENT
  // ======================================================

  const handleStripePayment = () => {
    if (!selectedConsultation) {
      setMessage("Please select a consultation type first.");
      return;
    }

    const serverUrl = import.meta.env.VITE_SERVER_URL;

    if (!serverUrl) {
      setMessage("Payment server is not configured.");
      return;
    }

    setLoading(true);
    setMessage("");

    window.location.href =
      `${serverUrl}/api/consultations/stripe` +
      `?type=${encodeURIComponent(selectedConsultation)}`;
  };

  // ======================================================
  // BANK TRANSFER
  // ======================================================

  const handleBankTransfer = () => {
    if (!selectedConsultation) {
      setMessage("Please select a consultation type first.");
      return;
    }

    setShowBankDetails(true);
    setMessage("");
  };

  // ======================================================
  // BANK TRANSFER RECEIPT
  // ======================================================

  const handleReceiptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setBankTransferReceipt(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setBankTransferReceipt(null);
      setMessage("Please upload an image of your payment receipt.");
      return;
    }

    setBankTransferReceipt(file);
    setMessage("");
  };

  // ======================================================
  // SUBMIT BANK TRANSFER
  // ======================================================

  const handleWhatsAppTransferConfirmation = async () => {
    if (!selectedConsultation) {
      setMessage("Please select a consultation type first.");
      return;
    }

    if (!bankTransferReceipt) {
      setMessage("Please upload your payment receipt first.");
      return;
    }

    const consultation = consultations.find(
      (item) => item.type === selectedConsultation,
    );

    if (!consultation) {
      setMessage("Consultation details could not be found.");
      return;
    }

    const serverUrl = import.meta.env.VITE_SERVER_URL;

    if (!serverUrl) {
      setMessage("Payment server is not configured.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // ==================================================
      // FORM DATA
      // ==================================================

      const transferFormData = new FormData();

      transferFormData.append("type", selectedConsultation);

      transferFormData.append("receipt", bankTransferReceipt);

      // ==================================================
      // SEND TO BACKEND
      // ==================================================

      const response = await fetch(
        `${serverUrl}/api/consultations/bank-transfer`,
        {
          method: "POST",
          credentials: "include",
          body: transferFormData,
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to record your bank transfer.");
      }

      // ==================================================
      // WHATSAPP
      // ==================================================

      const whatsappMessage = encodeURIComponent(
        `Hello, I have completed a bank transfer for a ${consultation.name}.

Consultation Type: ${consultation.name}
Amount: $${consultation.amount.toFixed(2)}

My payment receipt has been uploaded for verification.

Consultation ID: ${data.consultationId}

Thank you.`,
      );

      window.open(
        `https://wa.me/2349023323697?text=${whatsappMessage}`,
        "_blank",
        "noopener,noreferrer",
      );

      // ==================================================
      // SUCCESS
      // ==================================================

      setMessage(
        "Your payment receipt has been submitted successfully. Your payment is now pending verification.",
      );

      setBankTransferReceipt(null);
    } catch (error) {
      console.error("Bank transfer request error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Your transfer confirmation could not be recorded. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedDetails = consultations.find(
    (consultation) => consultation.type === selectedConsultation,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* ======================================================
            HERO
        ====================================================== */}

        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-5 py-2 rounded-full mb-6">
            <ShieldCheck size={20} />

            <span className="font-semibold">
              Confidential Spiritual Guidance
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-yellow-400 mb-8">
            Spiritual Consultation
          </h1>

          <p className="max-w-4xl mx-auto text-xl text-gray-300 leading-9">
            Seek wisdom, clarity, guidance and spiritual solutions through
            authentic Yoruba traditional consultation and sacred teachings.
          </p>
        </div>

        {/* ======================================================
            SERVICES
        ====================================================== */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-purple-900/80 border border-yellow-500/70 rounded-3xl p-8 shadow-xl hover:shadow-yellow-500/10 hover:-translate-y-1 transition duration-300"
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                {service.title}
              </h2>

              <p className="text-gray-300 leading-8">{service.description}</p>
            </div>
          ))}
        </div>

        {/* ======================================================
            CONSULTATION BOOKING
        ====================================================== */}

        <div className="bg-purple-900 border border-yellow-500 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6">
              Book A Consultation
            </h2>

            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-8">
              Choose the consultation that best suits your needs, then select
              your preferred payment method.
            </p>
          </div>

          {/* ====================================================
              CONSULTATION TYPES
          ==================================================== */}

          {pricingLoading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 text-yellow-400 text-lg font-semibold">
                <div className="w-6 h-6 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                Loading current consultation prices...
              </div>
            </div>
          ) : consultations.length === 0 ? (
            <div className="max-w-2xl mx-auto mb-12 bg-red-900/40 border border-red-500 text-red-200 rounded-2xl p-6 text-center">
              {message || "Unable to load current consultation prices."}

              <button
                type="button"
                onClick={() => void loadPricing()}
                className="block mx-auto mt-4 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold transition"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
              {consultations.map((consultation) => {
                const isSelected = selectedConsultation === consultation.type;

                return (
                  <button
                    key={consultation.type}
                    type="button"
                    onClick={() => handleSelectConsultation(consultation.type)}
                    className={`text-left rounded-3xl p-8 border-2 transition duration-300 ${
                      isSelected
                        ? "border-yellow-400 bg-purple-800 shadow-2xl scale-[1.02]"
                        : "border-purple-600 bg-purple-950 hover:border-yellow-500 hover:bg-purple-900"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <h3 className="text-2xl font-bold text-yellow-400">
                          {consultation.name}
                        </h3>

                        {isSelected && (
                          <div className="flex items-center gap-2 text-green-400 font-semibold mt-3">
                            <CheckCircle size={20} />
                            Selected
                          </div>
                        )}
                      </div>

                      <span className="text-3xl font-bold text-white whitespace-nowrap">
                        ${consultation.amount.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-gray-300 leading-7">
                      {consultation.description}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* ====================================================
              SELECTED CONSULTATION SUMMARY
          ==================================================== */}

          {selectedDetails && (
            <div className="max-w-4xl mx-auto mb-10 bg-yellow-500/10 border border-yellow-500/40 rounded-2xl p-6 text-center">
              <p className="text-yellow-300 font-semibold mb-2">
                Selected Consultation
              </p>

              <h3 className="text-2xl font-bold text-white">
                {selectedDetails.name}
              </h3>

              <p className="text-yellow-400 text-xl font-bold mt-2">
                ${selectedDetails.amount.toFixed(2)}
              </p>
            </div>
          )}

          {/* ====================================================
              PAYMENT OPTIONS
          ==================================================== */}

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-yellow-400 mb-6">
              Choose Payment Method
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* STRIPE */}

              <button
                type="button"
                onClick={handleStripePayment}
                disabled={
                  loading || pricingLoading || consultations.length === 0
                }
                className="group flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-black px-8 py-5 rounded-2xl font-bold text-lg transition duration-300 shadow-lg hover:shadow-yellow-500/30"
              >
                <CreditCard
                  size={26}
                  className="group-hover:scale-110 transition"
                />

                {loading ? "Opening Secure Payment..." : "Pay Online with Card"}
              </button>

              {/* BANK TRANSFER */}

              <button
                type="button"
                onClick={handleBankTransfer}
                disabled={
                  loading || pricingLoading || consultations.length === 0
                }
                className="group flex items-center justify-center gap-3 border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black disabled:opacity-60 disabled:cursor-not-allowed px-8 py-5 rounded-2xl font-bold text-lg transition duration-300"
              >
                <Landmark
                  size={26}
                  className="group-hover:scale-110 transition"
                />
                Pay by Bank Transfer
              </button>
            </div>

            {/* ==================================================
                MESSAGE
            ================================================== */}

            {message && consultations.length > 0 && (
              <div
                className={`mt-6 rounded-xl p-4 text-center ${
                  message.toLowerCase().includes("successfully") ||
                  message.toLowerCase().includes("pending")
                    ? "bg-green-900/40 border border-green-500 text-green-200"
                    : "bg-red-900/40 border border-red-500 text-red-200"
                }`}
              >
                {message}
              </div>
            )}
          </div>

          {/* ====================================================
              BANK TRANSFER DETAILS
          ==================================================== */}

          {showBankDetails && selectedDetails && (
            <div className="max-w-3xl mx-auto mt-10 bg-white text-gray-900 rounded-3xl p-8 md:p-10 shadow-2xl border-4 border-yellow-500">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center bg-purple-100 rounded-full p-4 mb-4">
                  <Landmark className="text-purple-900" size={40} />
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-purple-900">
                  Bank Transfer
                </h3>

                <p className="text-gray-600 mt-3">
                  Please transfer the current Naira equivalent of the
                  consultation fee.
                </p>
              </div>

              {/* CONSULTATION SUMMARY */}

              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <p className="text-sm text-purple-600 font-semibold uppercase tracking-wide">
                      Consultation
                    </p>

                    <p className="text-xl font-bold text-purple-900 mt-1">
                      {selectedDetails.name}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-sm text-purple-600 font-semibold uppercase tracking-wide">
                      Consultation Fee
                    </p>

                    <p className="text-2xl font-bold text-yellow-700 mt-1">
                      ${selectedDetails.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* BANK DETAILS */}

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 space-y-5">
                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                    Bank
                  </p>

                  <p className="text-xl font-bold text-purple-900">
                    Zenith Bank
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                    Account Name
                  </p>

                  <p className="text-xl font-bold text-purple-900">
                    ARUN-UN-TAN LIMITED
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                    Account Number
                  </p>

                  <p className="text-2xl font-bold text-purple-900 tracking-wider">
                    1229796653
                  </p>
                </div>
              </div>

              {/* NAIRA PAYMENT NOTE */}

              <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-6 mb-8">
                <h4 className="font-bold text-lg text-purple-900 mb-3">
                  Naira Payment Note
                </h4>

                <p className="text-gray-800 leading-7">
                  If you are paying in Naira (₦), please send the{" "}
                  <strong>current Naira equivalent</strong> of the stated
                  consultation fee at the time of payment.
                </p>

                <p className="text-gray-700 leading-7 mt-3 text-sm">
                  The Naira equivalent may change depending on the current
                  exchange rate. Please confirm the applicable amount before
                  making your transfer.
                </p>
              </div>

              {/* ==================================================
                  RECEIPT UPLOAD
              ================================================== */}

              <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <Upload className="text-purple-900" size={25} />

                  <h4 className="font-bold text-xl text-purple-900">
                    Upload Payment Receipt
                  </h4>
                </div>

                <p className="text-gray-700 leading-7 mb-5">
                  Please upload a clear screenshot or image of your bank
                  transfer receipt. Your payment cannot be submitted for
                  verification without the receipt.
                </p>

                <input
                  id="consultation-receipt"
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptChange}
                  disabled={loading}
                  className="block w-full text-sm text-gray-700
                    file:mr-4
                    file:py-3
                    file:px-5
                    file:rounded-xl
                    file:border-0
                    file:bg-purple-900
                    file:text-white
                    file:font-semibold
                    hover:file:bg-purple-800
                    disabled:opacity-60"
                />

                {bankTransferReceipt && (
                  <div className="mt-4 bg-green-50 border border-green-300 rounded-xl p-4">
                    <p className="text-green-800 font-semibold">
                      Receipt selected
                    </p>

                    <p className="text-green-700 text-sm mt-1 break-all">
                      {bankTransferReceipt.name}
                    </p>
                  </div>
                )}
              </div>

              {/* IMPORTANT */}

              <div className="bg-yellow-100 border-2 border-yellow-500 rounded-2xl p-6 mb-8">
                <h4 className="font-bold text-xl text-purple-900 mb-3">
                  Important
                </h4>

                <p className="text-gray-800 leading-7">
                  After making your bank transfer, upload your payment receipt
                  and click the button below.
                </p>

                <p className="text-gray-800 leading-7 mt-3">
                  <strong>
                    Your payment will remain pending until an administrator
                    verifies the transfer.
                  </strong>
                </p>

                <p className="text-gray-800 leading-7 mt-3">
                  Once verified, your consultation can proceed.
                </p>
              </div>

              {/* ==================================================
                  WHATSAPP
              ================================================== */}

              <button
                type="button"
                onClick={handleWhatsAppTransferConfirmation}
                disabled={loading || !bankTransferReceipt}
                className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-5 rounded-2xl font-bold text-lg transition duration-300 shadow-lg"
              >
                <MessageCircle size={26} />

                {loading
                  ? "Uploading Receipt..."
                  : "Submit Transfer & Send Confirmation"}
              </button>

              {!bankTransferReceipt && (
                <p className="text-center text-red-600 text-sm font-semibold mt-3">
                  Please upload your payment receipt before submitting.
                </p>
              )}

              {/* BACK */}

              <button
                type="button"
                onClick={() => {
                  setShowBankDetails(false);
                  setBankTransferReceipt(null);
                  setMessage("");
                }}
                disabled={loading}
                className="w-full mt-4 border-2 border-gray-300 hover:bg-gray-100 disabled:opacity-60 text-gray-700 px-8 py-4 rounded-2xl font-semibold transition duration-300"
              >
                Back to Payment Options
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;
