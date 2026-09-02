import { useCallback, useEffect, useState } from "react";

import axios from "axios";

import {
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  CreditCard,
  Building2,
  CalendarDays,
  Clock3,
  MapPin,
  Send,
  Loader2,
} from "lucide-react";

interface InitiationPayment {
  _id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  initiationPackage?: "Basic" | "Standard" | "Premium";
  paymentAmount?: number;
  paymentMethod?: "stripe" | "bank_transfer";
  paymentStatus?: "Pending" | "Paid";
  paymentReference?: string;
  paymentDate?: string;
  bankTransferStatus?: "Pending" | "Verified" | "Rejected";
  bankTransferReference?: string;
  bankTransferReceipt?: string;
  bankTransferDate?: string;
  status?: string;
  createdAt?: string;
  initiationDate?: string;
  initiationTime?: string;
  initiationVenue?: string;
  initiationInstructions?: string;
  initiationStatus?: "Pending" | "Scheduled" | "Completed";
}

interface InitiationPaymentsResponse {
  success: boolean;
  count: number;
  applications: InitiationPayment[];
}

interface ApiErrorResponse {
  message?: string;
}

interface ScheduleResponse {
  success: boolean;
  message?: string;
}

const InitiationPayments = () => {
  const [payments, setPayments] = useState<InitiationPayment[]>([]);

  const [loading, setLoading] = useState(true);

  const [processingId, setProcessingId] = useState<string | null>(null);

  const [error, setError] = useState("");

  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [selectedPayment, setSelectedPayment] =
    useState<InitiationPayment | null>(null);

  const [initiationDate, setInitiationDate] = useState("");

  const [initiationTime, setInitiationTime] = useState("");

  const [initiationVenue, setInitiationVenue] = useState("");

  const [initiationInstructions, setInitiationInstructions] = useState("");

  const [scheduling, setScheduling] = useState(false);

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      return err.response?.data?.message || fallback;
    }

    if (err instanceof Error) {
      return err.message;
    }

    return fallback;
  };

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get<InitiationPaymentsResponse>(
        `${serverUrl}/api/admin/initiation-payments`,
        {
          withCredentials: true,
        },
      );

      setPayments(response.data.applications || []);
    } catch (err: unknown) {
      console.error("Error fetching initiation payments:", err);

      setError(getErrorMessage(err, "Unable to load initiation payments."));
    } finally {
      setLoading(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    void fetchPayments();
  }, [fetchPayments]);

  const handleVerify = async (applicationId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to verify this bank transfer? This will mark the initiation payment as PAID.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(applicationId);
      setError("");

      await axios.patch(
        `${serverUrl}/api/admin/initiation-payments/${applicationId}/verify`,
        {},
        {
          withCredentials: true,
        },
      );

      alert("Bank transfer verified successfully.");

      await fetchPayments();
    } catch (err: unknown) {
      console.error("Error verifying payment:", err);

      setError(getErrorMessage(err, "Unable to verify this bank transfer."));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this bank transfer?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingId(applicationId);
      setError("");

      await axios.patch(
        `${serverUrl}/api/admin/initiation-payments/${applicationId}/reject`,
        {},
        {
          withCredentials: true,
        },
      );

      alert("Bank transfer rejected.");

      await fetchPayments();
    } catch (err: unknown) {
      console.error("Error rejecting payment:", err);

      setError(getErrorMessage(err, "Unable to reject this bank transfer."));
    } finally {
      setProcessingId(null);
    }
  };

  const openScheduleModal = (payment: InitiationPayment) => {
    setSelectedPayment(payment);

    setInitiationDate(
      payment.initiationDate
        ? new Date(payment.initiationDate).toISOString().split("T")[0]
        : "",
    );

    setInitiationTime(payment.initiationTime || "");

    setInitiationVenue(payment.initiationVenue || "");

    setInitiationInstructions(payment.initiationInstructions || "");

    setError("");

    setShowScheduleModal(true);
  };

  const closeScheduleModal = () => {
    if (scheduling) {
      return;
    }

    setShowScheduleModal(false);
    setSelectedPayment(null);
    setInitiationDate("");
    setInitiationTime("");
    setInitiationVenue("");
    setInitiationInstructions("");
  };

  const handleScheduleAndSend = async () => {
    if (!selectedPayment) {
      return;
    }

    if (!initiationDate) {
      setError("Please select the initiation date.");
      return;
    }

    if (!initiationTime) {
      setError("Please enter the initiation time.");
      return;
    }

    if (!initiationVenue.trim()) {
      setError("Please enter the initiation venue.");
      return;
    }

    if (!initiationInstructions.trim()) {
      setError("Please enter the initiation instructions.");
      return;
    }

    const confirmed = window.confirm(
      `Schedule the initiation for ${selectedPayment.fullName || "this applicant"} and send the initiation details by email?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setScheduling(true);
      setError("");

      const response = await axios.post<ScheduleResponse>(
        `${serverUrl}/api/membership-applications/schedule-initiation/${selectedPayment._id}`,
        {
          initiationDate,
          initiationTime,
          initiationVenue: initiationVenue.trim(),
          initiationInstructions: initiationInstructions.trim(),
        },
        {
          withCredentials: true,
        },
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Unable to schedule the initiation.",
        );
      }

      alert(
        response.data.message ||
          "Initiation scheduled and email sent successfully.",
      );

      closeScheduleModal();

      await fetchPayments();
    } catch (err: unknown) {
      console.error("Error scheduling initiation:", err);

      setError(
        getErrorMessage(
          err,
          "Unable to schedule the initiation and send the email.",
        ),
      );
    } finally {
      setScheduling(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString();
  };

  const getPaymentStatus = (payment: InitiationPayment) => {
    if (payment.paymentStatus === "Paid") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <CheckCircle size={14} />
          Paid
        </span>
      );
    }

    if (payment.bankTransferStatus === "Rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          <XCircle size={14} />
          Rejected
        </span>
      );
    }

    if (
      payment.paymentMethod === "bank_transfer" &&
      payment.bankTransferStatus === "Pending"
    ) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
          Pending Verification
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
        Pending
      </span>
    );
  };

  const getPackageBadge = (packageName?: string) => {
    switch (packageName) {
      case "Basic":
        return (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            Basic
          </span>
        );

      case "Standard":
        return (
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            Standard
          </span>
        );

      case "Premium":
        return (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Premium
          </span>
        );

      default:
        return <span className="text-gray-400">—</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="animate-spin" size={22} />
          Loading initiation payments...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Initiation Payments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review payments, verify bank transfers, and schedule paid applicants
            for initiation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void fetchPayments();
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-800"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary Cards */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Payments</p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {payments.length}
              </p>
            </div>

            <div className="rounded-lg bg-purple-100 p-3 text-purple-700">
              <CreditCard size={24} />
            </div>
          </div>
        </div>

        {/* Bank Transfers */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Bank Transfers</p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {
                  payments.filter(
                    (payment) => payment.paymentMethod === "bank_transfer",
                  ).length
                }
              </p>
            </div>

            <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
              <Building2 size={24} />
            </div>
          </div>
        </div>

        {/* Awaiting Verification */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Awaiting Verification</p>

              <p className="mt-1 text-2xl font-bold text-yellow-600">
                {
                  payments.filter(
                    (payment) =>
                      payment.paymentMethod === "bank_transfer" &&
                      payment.bankTransferStatus === "Pending" &&
                      payment.paymentStatus === "Pending",
                  ).length
                }
              </p>
            </div>

            <div className="rounded-lg bg-yellow-100 p-3 text-yellow-700">
              <RefreshCw size={24} />
            </div>
          </div>
        </div>

        {/* Paid */}

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paid</p>

              <p className="mt-1 text-2xl font-bold text-green-600">
                {
                  payments.filter((payment) => payment.paymentStatus === "Paid")
                    .length
                }
              </p>
            </div>

            <div className="rounded-lg bg-green-100 p-3 text-green-700">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}

      {payments.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <CreditCard size={40} className="mx-auto mb-4 text-gray-400" />

          <h2 className="text-lg font-semibold text-gray-700">
            No initiation payments yet
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Initiation payments will appear here once applicants select an
            initiation package.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}

          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="px-5 py-4">Applicant</th>

                    <th className="px-5 py-4">Package</th>

                    <th className="px-5 py-4">Amount</th>

                    <th className="px-5 py-4">Method</th>

                    <th className="px-5 py-4">Status</th>

                    <th className="px-5 py-4">Reference</th>

                    <th className="px-5 py-4">Receipt</th>

                    <th className="px-5 py-4">Date</th>

                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-800">
                          {payment.fullName || "Unknown"}
                        </div>

                        <div className="text-xs text-gray-500">
                          {payment.email || "No email"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {getPackageBadge(payment.initiationPackage)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-800">
                        ${Number(payment.paymentAmount || 0).toFixed(2)}
                      </td>

                      <td className="px-5 py-4">
                        {payment.paymentMethod === "stripe" ? (
                          <span className="inline-flex items-center gap-1 text-indigo-600">
                            <CreditCard size={15} />
                            Stripe
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-blue-600">
                            <Building2 size={15} />
                            Bank Transfer
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">{getPaymentStatus(payment)}</td>

                      <td className="max-w-[180px] truncate px-5 py-4 text-xs text-gray-500">
                        {payment.bankTransferReference ||
                          payment.paymentReference ||
                          "—"}
                      </td>

                      <td className="px-5 py-4">
                        {payment.bankTransferReceipt ? (
                          <a
                            href={payment.bankTransferReceipt}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
                          >
                            View Receipt
                            <ExternalLink size={14} />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">
                            No receipt
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-500">
                        {formatDate(
                          payment.bankTransferDate ||
                            payment.paymentDate ||
                            payment.createdAt,
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">
                        {payment.paymentMethod === "bank_transfer" &&
                        payment.bankTransferStatus === "Pending" &&
                        payment.paymentStatus === "Pending" ? (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={processingId === payment._id}
                              onClick={() => {
                                void handleVerify(payment._id);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CheckCircle size={14} />
                              Verify
                            </button>

                            <button
                              type="button"
                              disabled={processingId === payment._id}
                              onClick={() => {
                                void handleReject(payment._id);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <XCircle size={14} />
                              Reject
                            </button>
                          </div>
                        ) : payment.paymentStatus === "Paid" ? (
                          <button
                            type="button"
                            onClick={() => {
                              openScheduleModal(payment);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-purple-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-purple-800"
                          >
                            <CalendarDays size={14} />

                            {payment.initiationStatus === "Scheduled"
                              ? "Update & Resend"
                              : "Schedule Initiation"}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}

          <div className="space-y-4 lg:hidden">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="rounded-xl bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {payment.fullName || "Unknown Applicant"}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {payment.email || "No email"}
                    </p>
                  </div>

                  {getPaymentStatus(payment)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Package</p>

                    <div className="mt-1">
                      {getPackageBadge(payment.initiationPackage)}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Amount</p>

                    <p className="mt-1 font-bold text-gray-800">
                      ${Number(payment.paymentAmount || 0).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Method</p>

                    <p className="mt-1 font-medium text-gray-700">
                      {payment.paymentMethod === "stripe"
                        ? "Stripe"
                        : "Bank Transfer"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Date</p>

                    <p className="mt-1 text-xs text-gray-600">
                      {formatDate(
                        payment.bankTransferDate ||
                          payment.paymentDate ||
                          payment.createdAt,
                      )}
                    </p>
                  </div>
                </div>

                {payment.bankTransferReference && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-400">Transfer Reference</p>

                    <p className="mt-1 break-all text-sm text-gray-700">
                      {payment.bankTransferReference}
                    </p>
                  </div>
                )}

                {payment.bankTransferReceipt && (
                  <a
                    href={payment.bankTransferReceipt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                  >
                    View Payment Receipt
                    <ExternalLink size={16} />
                  </a>
                )}

                {payment.paymentMethod === "bank_transfer" &&
                  payment.bankTransferStatus === "Pending" &&
                  payment.paymentStatus === "Pending" && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        disabled={processingId === payment._id}
                        onClick={() => {
                          void handleVerify(payment._id);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircle size={16} />
                        Verify
                      </button>

                      <button
                        type="button"
                        disabled={processingId === payment._id}
                        onClick={() => {
                          void handleReject(payment._id);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}

                {payment.paymentStatus === "Paid" && (
                  <button
                    type="button"
                    onClick={() => {
                      openScheduleModal(payment);
                    }}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
                  >
                    <CalendarDays size={17} />

                    {payment.initiationStatus === "Scheduled"
                      ? "Update & Resend Initiation Details"
                      : "Schedule Initiation"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* SCHEDULE MODAL */}

      {showScheduleModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b bg-purple-900 px-6 py-5 text-white">
              <div>
                <h2 className="text-xl font-bold">Schedule Initiation</h2>

                <p className="mt-1 text-sm text-purple-100">
                  {selectedPayment.fullName || "Applicant"}
                </p>

                <p className="text-xs text-purple-200">
                  {selectedPayment.email || "No email"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeScheduleModal}
                disabled={scheduling}
                className="rounded-lg px-3 py-2 text-xl text-white hover:bg-purple-800 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Payment Summary */}

              <div className="mb-6 rounded-xl bg-green-50 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <CheckCircle size={22} className="text-green-600" />

                  <span className="font-bold text-green-800">
                    Initiation Payment Paid
                  </span>

                  {getPackageBadge(selectedPayment.initiationPackage)}

                  <span className="font-bold text-green-800">
                    ${Number(selectedPayment.paymentAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Date */}

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={17} />
                    Initiation Date
                  </span>
                </label>

                <input
                  type="date"
                  value={initiationDate}
                  onChange={(event) => setInitiationDate(event.target.value)}
                  disabled={scheduling}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100"
                />
              </div>

              {/* Time */}

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={17} />
                    Initiation Time
                  </span>
                </label>

                <input
                  type="text"
                  value={initiationTime}
                  onChange={(event) => setInitiationTime(event.target.value)}
                  placeholder="e.g. 10:00 AM"
                  disabled={scheduling}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100"
                />
              </div>

              {/* Venue */}

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={17} />
                    Initiation Venue
                  </span>
                </label>

                <input
                  type="text"
                  value={initiationVenue}
                  onChange={(event) => setInitiationVenue(event.target.value)}
                  placeholder="Enter the initiation venue"
                  disabled={scheduling}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100"
                />
              </div>

              {/* Instructions */}

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Initiation Instructions
                </label>

                <textarea
                  value={initiationInstructions}
                  onChange={(event) =>
                    setInitiationInstructions(event.target.value)
                  }
                  placeholder="Enter everything the applicant needs to know before attending the initiation."
                  rows={6}
                  disabled={scheduling}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100"
                />
              </div>

              {/* Error */}

              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Notice */}

              <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm leading-6 text-blue-800">
                  When you click the button below, the initiation date, time,
                  venue and instructions will be saved to the applicant's record
                  and the initiation email will be sent to the applicant.
                </p>
              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeScheduleModal}
                  disabled={scheduling}
                  className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    void handleScheduleAndSend();
                  }}
                  disabled={scheduling}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-700 px-5 py-3 font-bold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {scheduling ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={19} />
                      Schedule & Send Details
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitiationPayments;
