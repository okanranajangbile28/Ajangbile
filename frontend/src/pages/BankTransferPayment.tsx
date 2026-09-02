import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  Upload,
  Loader2,
  FileImage,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

interface PaymentDetails {
  applicationId: string;
  packageName: string;
  packageDisplayName: string;
  amountUSD: number;
}

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  additionalInfo: string;
}

interface BankTransferResponse {
  success: boolean;
  payment: PaymentDetails;
  bankDetails: BankDetails;
  notice?: string;
  receiptNotice?: string;
  message?: string;
}

interface ReceiptUploadResponse {
  success: boolean;
  receiptUrl?: string;
  url?: string;
  data?: {
    receiptUrl?: string;
    url?: string;
  };
  message?: string;
}

interface SubmitPaymentResponse {
  success: boolean;
  message?: string;
  redirectUrl?: string;
}

interface ErrorResponse {
  message?: string;
}

const BankTransferPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ======================================================
  // STATE
  // ======================================================

  const [copied, setCopied] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null,
  );

  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);

  const [notice, setNotice] = useState("");

  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [receiptUrl, setReceiptUrl] = useState("");

  const [transferReference, setTransferReference] = useState("");

  const [loadingDetails, setLoadingDetails] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // ======================================================
  // URL PARAMETERS
  // ======================================================

  const params = new URLSearchParams(location.search);

  const applicationId = params.get("applicationId") || "";

  const packageName = params.get("packageName") || "";

  // ======================================================
  // SERVER URL
  // ======================================================

  const SERVER_URL =
    import.meta.env.VITE_SERVER_URL || "https://ajangbile.onrender.com";

  // ======================================================
  // LOAD PAYMENT DETAILS
  // ======================================================

  useEffect(() => {
    const loadPaymentDetails = async () => {
      if (!applicationId || !packageName) {
        setError("Application ID or package is missing.");
        setLoadingDetails(false);
        return;
      }

      try {
        setLoadingDetails(true);
        setError("");

        const response = await axios.get<BankTransferResponse>(
          `${SERVER_URL}/api/payments/initiation-bank-transfer`,
          {
            params: {
              applicationId,
              packageName,
            },
            withCredentials: true,
          },
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Unable to load payment details.",
          );
        }

        setPaymentDetails(response.data.payment);

        setBankDetails(response.data.bankDetails);

        setNotice(response.data.notice || response.data.receiptNotice || "");
      } catch (err: unknown) {
        console.error("Bank transfer details error:", err);

        const axiosError = err as AxiosError<ErrorResponse>;

        setError(
          axiosError.response?.data?.message ||
            (err instanceof Error
              ? err.message
              : "Unable to load payment details."),
        );
      } finally {
        setLoadingDetails(false);
      }
    };

    void loadPaymentDetails();
  }, [applicationId, packageName, SERVER_URL]);

  // ======================================================
  // COPY ACCOUNT NUMBER
  // ======================================================

  const handleCopy = async () => {
    if (!bankDetails?.accountNumber) {
      return;
    }

    try {
      await navigator.clipboard.writeText(bankDetails.accountNumber);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy account number:", err);
    }
  };

  // ======================================================
  // SELECT RECEIPT
  // ======================================================

  const handleReceiptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    setMessage("");

    setReceiptUrl("");

    // Only images
    if (!file.type.startsWith("image/")) {
      setError("Please select an image receipt.");

      setReceiptFile(null);

      event.target.value = "";

      return;
    }

    // Maximum 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError("Receipt image must be smaller than 10MB.");

      setReceiptFile(null);

      event.target.value = "";

      return;
    }

    setReceiptFile(file);
  };

  // ======================================================
  // UPLOAD RECEIPT
  // ======================================================

  const handleUploadReceipt = async () => {
    if (!receiptFile) {
      setError("Please select your payment receipt first.");

      return;
    }

    try {
      setUploading(true);

      setError("");

      setMessage("");

      const formData = new FormData();

      formData.append("image", receiptFile);

      const response = await axios.post<ReceiptUploadResponse>(
        `${SERVER_URL}/api/payments/initiation-bank-transfer/receipt`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      const uploadedUrl =
        response.data.receiptUrl ||
        response.data.url ||
        response.data.data?.receiptUrl ||
        response.data.data?.url;

      if (!uploadedUrl) {
        throw new Error(
          "Receipt was uploaded but no receipt URL was returned.",
        );
      }

      setReceiptUrl(uploadedUrl);

      setMessage(
        "Receipt uploaded successfully. You can now submit it for verification.",
      );
    } catch (err: unknown) {
      console.error("Receipt upload error:", err);

      const axiosError = err as AxiosError<ErrorResponse>;

      setError(
        axiosError.response?.data?.message ||
          (err instanceof Error
            ? err.message
            : "Unable to upload your receipt. Please try again."),
      );

      setReceiptUrl("");
    } finally {
      setUploading(false);
    }
  };

  // ======================================================
  // SUBMIT BANK TRANSFER
  // ======================================================

  const handleSubmit = async () => {
    if (!applicationId) {
      setError("Application ID is missing.");

      return;
    }

    if (!packageName) {
      setError("Initiation package is missing.");

      return;
    }

    if (!receiptUrl) {
      setError("Please upload your payment receipt before submitting.");

      return;
    }

    try {
      setSubmitting(true);

      setError("");

      setMessage("");

      const response = await axios.post<SubmitPaymentResponse>(
        `${SERVER_URL}/api/payments/initiation-bank-transfer`,
        {
          applicationId,
          packageName,
          receiptUrl,
          transferReference: transferReference.trim(),
        },
        {
          withCredentials: true,
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Unable to submit your payment.",
        );
      }

      setMessage(
        response.data.message ||
          "Your transfer receipt has been submitted successfully.",
      );

      window.setTimeout(() => {
        navigate(response.data.redirectUrl || "/bank-transfer-success");
      }, 1500);
    } catch (err: unknown) {
      console.error("Bank transfer submission error:", err);

      const axiosError = err as AxiosError<ErrorResponse>;

      setError(
        axiosError.response?.data?.message ||
          (err instanceof Error
            ? err.message
            : "Unable to submit your bank transfer."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loadingDetails) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
          <Loader2 size={42} className="animate-spin text-purple-900 mx-auto" />

          <p className="mt-5 text-gray-700 font-semibold">
            Loading payment details...
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ==================================================
            BACK
        ================================================== */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-800 font-semibold mb-6 hover:underline"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>

        {/* ==================================================
            MAIN CARD
        ================================================== */}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="bg-purple-900 text-white text-center px-6 py-10">
            <img
              src="/images/crest.png"
              alt="Ajangbile Heritage Crest"
              className="w-24 mx-auto mb-5"
            />

            <h1 className="text-3xl font-bold">Bank Transfer Payment</h1>

            <p className="mt-3 text-purple-100">
              Confederation of Ogboni Aborigine Fraternity of Nigeria
            </p>

            <p className="text-yellow-300 font-semibold mt-1">
              Ogun State Chapter • Iledi Ajangbile
            </p>
          </div>

          {/* ==================================================
              BODY
          ================================================== */}

          <div className="p-6 md:p-10">
            {/* ==================================================
                ERROR
            ================================================== */}

            {error && !paymentDetails && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 mb-8">
                {error}
              </div>
            )}

            {/* ==================================================
                PACKAGE INFORMATION
            ================================================== */}

            {paymentDetails && (
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-purple-900">
                  {paymentDetails.packageDisplayName}
                </h2>

                <p className="text-4xl font-bold text-purple-900 mt-4">
                  ${paymentDetails.amountUSD.toFixed(2)}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  Official initiation package amount
                </p>
              </div>
            )}

            {/* ==================================================
                IMPORTANT NOTICE
            ================================================== */}

            {notice && (
              <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-lg p-5 mb-8">
                <h3 className="font-bold text-purple-900 text-lg mb-2">
                  Important Payment Notice
                </h3>

                <p className="text-gray-700 leading-7">{notice}</p>
              </div>
            )}

            {/* ==================================================
                PAYMENT INSTRUCTIONS
            ================================================== */}

            <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-lg p-5 mb-8">
              <h3 className="font-bold text-purple-900 text-lg mb-2">
                Payment Instructions
              </h3>

              <p className="text-gray-700 leading-7">
                Please transfer the current Naira equivalent of the USD amount
                shown above to the bank account below. After completing the
                transfer, keep your payment receipt as proof of payment.
              </p>
            </div>

            {/* ==================================================
                BANK DETAILS
            ================================================== */}

            {bankDetails && (
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-purple-900 text-white px-5 py-4">
                  <h3 className="font-bold text-lg">Bank Account Details</h3>
                </div>

                <div className="p-6 space-y-5">
                  {/* BANK */}

                  <div>
                    <p className="text-sm text-gray-500">Bank Name</p>

                    <p className="font-bold text-gray-900 text-lg">
                      {bankDetails.bankName || "ZENITH BANK"}
                    </p>
                  </div>

                  {/* ACCOUNT NAME */}

                  <div>
                    <p className="text-sm text-gray-500">Account Name</p>

                    <p className="font-bold text-gray-900 text-lg">
                      {bankDetails.accountName || "ARUN-UN-TAN LIMITED"}
                    </p>
                  </div>

                  {/* ACCOUNT NUMBER */}

                  <div>
                    <p className="text-sm text-gray-500">Account Number</p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="font-bold text-purple-900 text-xl tracking-wider">
                        {bankDetails.accountNumber || "1229796653"}
                      </p>

                      <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center justify-center gap-2 bg-purple-100 text-purple-900 px-4 py-2 rounded-lg font-semibold hover:bg-purple-200"
                      >
                        {copied ? (
                          <>
                            <CheckCircle size={18} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={18} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ADDITIONAL INFORMATION */}

                  {bankDetails.additionalInfo && (
                    <div>
                      <p className="text-sm text-gray-500">
                        Additional Information
                      </p>

                      <p className="text-gray-700 mt-1 leading-7">
                        {bankDetails.additionalInfo}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================================================
                APPLICATION REFERENCE
            ================================================== */}

            {applicationId && (
              <div className="mt-8 bg-gray-50 rounded-xl p-5">
                <p className="text-sm text-gray-500">Application Reference</p>

                <p className="font-bold text-gray-900 mt-1 break-all">
                  {applicationId}
                </p>

                <p className="text-sm text-gray-600 mt-3">
                  Please keep this application reference for your records.
                </p>
              </div>
            )}

            {/* ==================================================
                TRANSFER REFERENCE
            ================================================== */}

            <div className="mt-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transfer Reference / Transaction ID
                <span className="font-normal text-gray-500"> (optional)</span>
              </label>

              <input
                type="text"
                value={transferReference}
                onChange={(event) => setTransferReference(event.target.value)}
                placeholder="Enter your bank transfer reference"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-700"
              />
            </div>

            {/* ==================================================
                RECEIPT UPLOAD
            ================================================== */}

            <div className="mt-8 border-2 border-dashed border-purple-300 rounded-xl p-6 bg-purple-50">
              <div className="text-center">
                <FileImage className="mx-auto text-purple-800 mb-3" size={42} />

                <h3 className="text-xl font-bold text-purple-900">
                  Upload Payment Receipt
                </h3>

                <p className="text-gray-600 mt-2">
                  Upload a clear screenshot or photo of your bank transfer
                  receipt.
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  Accepted: image files • Maximum 10MB
                </p>
              </div>

              {/* FILE INPUT */}

              <div className="mt-5">
                <label className="flex items-center justify-center gap-2 cursor-pointer bg-white border border-purple-300 text-purple-900 font-semibold px-5 py-3 rounded-lg hover:bg-purple-100 transition">
                  <Upload size={20} />

                  {receiptFile ? receiptFile.name : "Choose Receipt Image"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* SELECTED FILE */}

              {receiptFile && (
                <div className="mt-5 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Selected receipt:
                  </p>

                  <p className="font-semibold text-gray-800 break-all">
                    {receiptFile.name}
                  </p>

                  {/* UPLOAD BUTTON */}

                  {!receiptUrl && (
                    <button
                      type="button"
                      onClick={handleUploadReceipt}
                      disabled={uploading}
                      className="mt-4 inline-flex items-center justify-center gap-2 bg-purple-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={20} />
                          Upload Receipt
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* UPLOAD SUCCESS */}

              {receiptUrl && (
                <div className="mt-5 bg-green-100 border border-green-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 font-bold">
                    <CheckCircle size={22} />
                    Receipt Uploaded Successfully
                  </div>

                  <p className="text-sm text-green-700 mt-2">
                    Your receipt is ready to be submitted for verification.
                  </p>
                </div>
              )}
            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {error && paymentDetails && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                {error}
              </div>
            )}

            {/* ==================================================
                SUCCESS MESSAGE
            ================================================== */}

            {message && (
              <div className="mt-6 bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle size={20} />

                  {message}
                </div>
              </div>
            )}

            {/* ==================================================
                SUBMIT PAYMENT RECEIPT
            ================================================== */}

            <div className="mt-8">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!receiptUrl || submitting}
                className="w-full flex items-center justify-center gap-2 bg-purple-900 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={22} />
                    Submit Payment Receipt
                  </>
                )}
              </button>

              {!receiptUrl && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Upload your receipt before submitting.
                </p>
              )}
            </div>

            {/* ==================================================
                WHAT HAPPENS NEXT
            ================================================== */}

            <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex gap-3">
                <CheckCircle
                  className="text-green-600 flex-shrink-0"
                  size={24}
                />

                <div>
                  <h3 className="font-bold text-green-800">
                    What Happens Next?
                  </h3>

                  <p className="text-green-800 mt-2 leading-7">
                    Your payment receipt will be reviewed by the administration.
                    Your payment will remain pending until the bank transfer has
                    been verified.
                  </p>

                  <p className="text-green-800 mt-2 leading-7">
                    Once your payment is verified, the administration will
                    schedule your initiation ceremony and send your initiation
                    date, time, venue and further instructions to you.
                  </p>
                </div>
              </div>
            </div>

            {/* ==================================================
                WEBSITE
            ================================================== */}

            <div className="text-center mt-10">
              <a
                href="https://www.ajangbileheritage.com"
                className="inline-block bg-purple-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-800"
              >
                Visit Ajangbile Heritage
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankTransferPayment;
