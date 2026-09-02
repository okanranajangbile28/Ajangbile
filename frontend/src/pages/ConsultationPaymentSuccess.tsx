import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, MessageCircle, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";

interface ConsultationPaymentResponse {
  success: boolean;
  paid: boolean;
  consultationType: string;
  consultationName: string;
  amountPaid: number;
  reference: string;
  whatsappUrl: string;
  message?: string;
}

interface ApiErrorResponse {
  message?: string;
}

const ConsultationPaymentSuccess = () => {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [consultationName, setConsultationName] = useState("");
  const [amountPaid, setAmountPaid] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setError("Payment session could not be found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<ConsultationPaymentResponse>(
          `${import.meta.env.VITE_SERVER_URL}/api/consultations/verify`,
          {
            params: {
              session_id: sessionId,
            },
          },
        );

        if (response.data.success && response.data.paid) {
          setPaid(true);
          setWhatsappUrl(response.data.whatsappUrl);
          setConsultationName(response.data.consultationName);
          setAmountPaid(response.data.amountPaid);
        } else {
          setError(
            response.data.message || "Your payment could not be verified.",
          );
        }
      } catch (err: unknown) {
        console.error("Consultation payment verification error:", err);

        if (axios.isAxiosError<ApiErrorResponse>(err)) {
          setError(
            err.response?.data?.message ||
              "We could not verify your consultation payment.",
          );
        } else {
          setError("We could not verify your consultation payment.");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  // ======================================================
  // VERIFYING PAYMENT
  // ======================================================

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-black flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-10 text-center border-4 border-yellow-500">
          <Loader2
            className="mx-auto text-purple-700 animate-spin mb-6"
            size={70}
          />

          <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">
            Verifying Your Payment
          </h1>

          <p className="text-gray-600 text-lg leading-8">
            Please wait while we confirm your consultation payment.
          </p>

          <div className="mt-8 h-2 w-full bg-purple-100 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 animate-pulse w-2/3 rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  // ======================================================
  // PAYMENT VERIFICATION FAILED
  // ======================================================

  if (error || !paid) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-black flex items-center justify-center px-6 py-16">
        <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-10 text-center border-4 border-red-500">
          <AlertCircle className="mx-auto text-red-600 mb-6" size={80} />

          <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">
            Payment Verification
          </h1>

          <p className="text-gray-600 text-lg leading-8 mb-8">
            {error || "We could not verify your payment."}
          </p>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8">
            <p className="text-red-700 font-semibold">
              If you completed the payment, please do not make another payment
              immediately. Contact us so we can check the transaction.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/consultation"
              className="inline-block bg-purple-900 text-white px-8 py-4 rounded-full font-bold hover:bg-purple-800 transition shadow-lg"
            >
              Return to Consultation
            </Link>

            <a
              href="https://wa.me/2349023323697"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition shadow-lg"
            >
              <MessageCircle size={22} />
              Contact Us
            </a>
          </div>
        </div>
      </section>
    );
  }

  // ======================================================
  // PAYMENT SUCCESSFUL
  // ======================================================

  return (
    <section className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-black flex items-center justify-center px-6 py-16">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl p-8 md:p-12 text-center border-4 border-yellow-500">
        {/* SUCCESS ICON */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="text-green-600" size={80} />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
          Payment Successful
        </h1>

        <p className="text-gray-700 text-lg leading-8 mb-8">
          Your consultation payment has been successfully verified.
        </p>

        {/* PAYMENT DETAILS */}
        <div className="bg-gradient-to-r from-purple-50 to-yellow-50 border-2 border-purple-300 rounded-2xl p-6 mb-8 shadow-md">
          <p className="text-purple-700 font-semibold text-lg mb-2">
            Consultation Type
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">
            {consultationName}
          </h2>

          {amountPaid !== null && (
            <div className="inline-block bg-yellow-100 border border-yellow-400 rounded-full px-6 py-2">
              <p className="text-xl font-bold text-yellow-800">
                Amount Paid: ${amountPaid.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {/* CONFIRMATION */}
        <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <CheckCircle className="text-green-600" size={24} />

            <h3 className="text-xl font-bold text-green-800">
              Payment Confirmed
            </h3>
          </div>

          <p className="text-gray-700 leading-8">
            Your payment has been received successfully. Your consultation
            request is now ready to be arranged.
          </p>
        </div>

        {/* NEXT STEP */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-purple-900 mb-3">Next Step</h3>

          <p className="text-gray-700 leading-8">
            Click the WhatsApp button below to contact us. A message confirming
            your payment and consultation type has already been prepared for
            you.
          </p>
        </div>

        {/* WHATSAPP BUTTON */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition duration-300 shadow-lg mb-6"
        >
          <MessageCircle size={26} />
          Continue to WhatsApp
        </a>

        <p className="text-gray-500 text-sm mb-8 leading-6">
          Please send the prepared WhatsApp message so we can begin arranging
          your consultation.
        </p>

        {/* RETURN HOME */}
        <Link
          to="/"
          className="inline-block border-2 border-purple-900 text-purple-900 px-8 py-3 rounded-full font-bold hover:bg-purple-900 hover:text-white transition"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
};

export default ConsultationPaymentSuccess;
