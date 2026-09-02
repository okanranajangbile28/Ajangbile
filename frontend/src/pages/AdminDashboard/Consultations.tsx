import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  FileImage,
  ExternalLink,
} from "lucide-react";

interface Consultation {
  _id: string;
  consultationType: string;
  consultationName: string;

  customerName?: string;
  email?: string;
  phone?: string;

  amount: number;
  currency: string;

  paymentMethod: "stripe" | "bank_transfer";

  paymentStatus: "pending" | "paid" | "failed";

  bankTransferStatus?: "pending" | "verified" | "rejected";

  bankTransferReceipt?: string;
  bankTransferReceiptPublicId?: string;
  bankTransferReference?: string;
  bankTransferDate?: string;

  stripeSessionId?: string;
  stripePaymentIntentId?: string;

  createdAt?: string;
  updatedAt?: string;
}

interface ConsultationsResponse {
  success: boolean;
  count: number;
  consultations: Consultation[];
}

const Consultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  // ======================================================
  // FETCH CONSULTATIONS
  // ======================================================

  const fetchConsultations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get<ConsultationsResponse>(
        `${serverUrl}/api/admin/consultations`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setConsultations(response.data.consultations);
      }
    } catch (err) {
      console.error("Error fetching consultations:", err);

      setError(
        "Unable to load consultations. Please make sure you are logged in as an admin.",
      );
    } finally {
      setLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  // ======================================================
  // VERIFY BANK TRANSFER
  // ======================================================

  const handleVerify = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to verify this bank transfer as paid?",
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      setError("");

      await axios.patch(
        `${serverUrl}/api/admin/consultations/${id}/paid`,
        {},
        {
          withCredentials: true,
        },
      );

      await fetchConsultations();
    } catch (err) {
      console.error("Error verifying consultation bank transfer:", err);

      window.alert("Unable to verify the payment. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  // ======================================================
  // REJECT BANK TRANSFER
  // ======================================================

  const handleReject = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this bank transfer?",
    );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      setError("");

      await axios.patch(
        `${serverUrl}/api/admin/consultations/${id}/reject`,
        {},
        {
          withCredentials: true,
        },
      );

      await fetchConsultations();
    } catch (err) {
      console.error("Error rejecting consultation bank transfer:", err);

      window.alert("Unable to reject the payment. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  // ======================================================
  // STATUS BADGE
  // ======================================================

  const getStatusBadge = (consultation: Consultation) => {
    if (consultation.paymentStatus === "paid") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          <CheckCircle size={15} />
          Paid
        </span>
      );
    }

    if (consultation.paymentStatus === "failed") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
          <XCircle size={15} />
          Failed
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
        <Clock size={15} />
        Pending
      </span>
    );
  };

  // ======================================================
  // PAYMENT METHOD
  // ======================================================

  const getPaymentMethod = (consultation: Consultation) => {
    if (consultation.paymentMethod === "stripe") {
      return (
        <span className="inline-flex items-center gap-2 text-sm font-medium text-purple-700">
          <CreditCard size={17} />
          Stripe
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-700">
        <Building2 size={17} />
        Bank Transfer
      </span>
    );
  };

  // ======================================================
  // RECEIPT
  // ======================================================

  const getReceipt = (consultation: Consultation) => {
    if (consultation.paymentMethod !== "bank_transfer") {
      return <span className="text-sm text-gray-400">—</span>;
    }

    if (!consultation.bankTransferReceipt) {
      return <span className="text-sm text-red-500">No receipt</span>;
    }

    return (
      <a
        href={consultation.bankTransferReceipt}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-purple-100 px-3 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-200"
      >
        <FileImage size={16} />
        View Receipt
        <ExternalLink size={14} />
      </a>
    );
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center p-8">
        <div className="flex items-center gap-3 text-purple-900">
          <RefreshCw className="animate-spin" size={24} />
          <span className="font-medium">Loading consultations...</span>
        </div>
      </div>
    );
  }

  // ======================================================
  // SUMMARY
  // ======================================================

  const totalConsultations = consultations.length;

  const pendingPayments = consultations.filter(
    (item) => item.paymentStatus === "pending",
  ).length;

  const paidConsultations = consultations.filter(
    (item) => item.paymentStatus === "paid",
  ).length;

  const pendingBankTransfers = consultations.filter(
    (item) =>
      item.paymentMethod === "bank_transfer" &&
      item.bankTransferStatus === "pending",
  ).length;

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-950 sm:text-3xl">
            Consultation Management
          </h1>

          <p className="mt-1 text-gray-600">
            View consultation requests and manage consultation payments.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchConsultations}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-950 px-5 py-3 font-semibold text-white transition hover:bg-purple-900"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Consultations
          </p>

          <p className="mt-2 text-3xl font-bold text-purple-950">
            {totalConsultations}
          </p>
        </div>

        {/* PENDING */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Pending Payments</p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {pendingPayments}
          </p>
        </div>

        {/* PAID */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Paid</p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            {paidConsultations}
          </p>
        </div>

        {/* BANK TRANSFER */}

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Bank Transfers Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {pendingBankTransfers}
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}

      {consultations.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <Calendar size={48} className="mx-auto mb-4 text-gray-400" />

          <h2 className="text-xl font-bold text-gray-800">
            No consultations yet
          </h2>

          <p className="mt-2 text-gray-500">
            Consultation requests will appear here after a customer starts a
            payment.
          </p>
        </div>
      ) : (
        /* CONSULTATION TABLE */

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1450px] w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                    Consultation
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                    Receipt
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {consultations.map((consultation) => {
                  const isProcessing = processingId === consultation._id;

                  const isPendingBankTransfer =
                    consultation.paymentMethod === "bank_transfer" &&
                    consultation.bankTransferStatus === "pending";

                  return (
                    <tr
                      key={consultation._id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      {/* CUSTOMER */}

                      <td className="px-5 py-5">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full bg-purple-100 p-2 text-purple-700">
                            <User size={18} />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {consultation.customerName ||
                                "Customer details pending"}
                            </p>

                            {consultation.email && (
                              <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                <Mail size={14} />
                                {consultation.email}
                              </p>
                            )}

                            {consultation.phone && (
                              <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                <Phone size={14} />
                                {consultation.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* CONSULTATION */}

                      <td className="px-5 py-5">
                        <p className="font-semibold text-gray-900">
                          {consultation.consultationName}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {consultation.consultationType}
                        </p>
                      </td>

                      {/* AMOUNT */}

                      <td className="px-5 py-5">
                        <p className="font-bold text-gray-900">
                          ${Number(consultation.amount).toFixed(2)}
                        </p>

                        <p className="text-xs text-gray-500">
                          {consultation.currency}
                        </p>
                      </td>

                      {/* PAYMENT */}

                      <td className="px-5 py-5">
                        {getPaymentMethod(consultation)}

                        {consultation.bankTransferStatus && (
                          <p className="mt-2 text-xs text-gray-500">
                            Bank status:{" "}
                            <span className="font-semibold capitalize">
                              {consultation.bankTransferStatus}
                            </span>
                          </p>
                        )}

                        {consultation.bankTransferDate && (
                          <p className="mt-1 text-xs text-gray-500">
                            Verified:{" "}
                            {new Date(
                              consultation.bankTransferDate,
                            ).toLocaleString()}
                          </p>
                        )}
                      </td>

                      {/* RECEIPT */}

                      <td className="px-5 py-5">{getReceipt(consultation)}</td>

                      {/* STATUS */}

                      <td className="px-5 py-5">
                        {getStatusBadge(consultation)}
                      </td>

                      {/* DATE */}

                      <td className="px-5 py-5 text-sm text-gray-600">
                        {consultation.createdAt
                          ? new Date(consultation.createdAt).toLocaleString()
                          : "—"}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-5">
                        {isPendingBankTransfer ? (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleVerify(consultation._id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CheckCircle size={15} />

                              {isProcessing ? "Processing..." : "Verify"}
                            </button>

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleReject(consultation._id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <XCircle size={15} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="text-right text-sm text-gray-400">
                            No action required
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultations;
