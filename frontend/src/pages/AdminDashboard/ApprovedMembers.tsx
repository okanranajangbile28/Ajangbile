import { useEffect, useState } from "react";
import axios from "axios";

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phone: string;

  gender?: string;
  dateOfBirth?: string;
  maritalStatus?: string;

  occupation: string;

  country?: string;
  state: string;
  city?: string;
  address?: string;

  nextOfKin?: string;
  nextOfKinPhone?: string;

  reason?: string;
  referredBy?: string;

  photo: string;
  signature?: string;

  status: string;

  applicationFeeStatus?: string;
  applicationFeeAmount?: number;
  applicationFeePaymentMethod?: string;
  applicationFeeReference?: string;

  paymentStatus?: string;
  paymentAmount?: number;
  paymentReference?: string;
  paymentMethod?: string;
  paymentDate?: string;

  initiationPackage?: "Basic" | "Standard" | "Premium";

  initiationStatus?: string;
  initiationDate?: string;
  initiationTime?: string;
  initiationVenue?: string;
  initiationInstructions?: string;
}

const ApprovedMembers = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const [selectedMember, setSelectedMember] = useState<Application | null>(
    null,
  );

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // ======================================================
  // FETCH APPROVED MEMBERS
  // ======================================================

  const fetchApprovedApplications = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/approved`,
      );

      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Failed to fetch approved members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedApplications();
  }, []);

  // ======================================================
  // RESEND APPROVAL EMAIL
  // ======================================================

  const resendEmail = async (id: string) => {
    if (resendingId) return;

    const confirmed = window.confirm(
      "Resend the membership approval email to this applicant?",
    );

    if (!confirmed) return;

    try {
      setResendingId(id);

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/resend-approval-email/${id}`,
      );

      alert(res.data?.message || "Approval email resent successfully.");
    } catch (err: unknown) {
      console.error("Resend approval email error:", err);

      if (axios.isAxiosError(err)) {
        alert(
          err.response?.data?.message || "Unable to resend approval email.",
        );
      } else {
        alert("Unable to resend approval email.");
      }
    } finally {
      setResendingId(null);
    }
  };

  // ======================================================
  // HELPERS
  // ======================================================

  const getPaymentStatus = (application: Application) => {
    if (application.paymentStatus === "Paid") {
      return "Paid";
    }

    return "Pending";
  };

  const getPaymentMethod = (application: Application) => {
    if (application.paymentMethod === "stripe") {
      return "Stripe";
    }

    if (
      application.paymentMethod === "bank_transfer" ||
      application.paymentMethod === "Bank Transfer"
    ) {
      return "Bank Transfer";
    }

    return "Not Selected";
  };

  const getInitiationStatus = (application: Application) => {
    if (application.initiationStatus === "Scheduled") {
      return "Scheduled";
    }

    if (application.paymentStatus === "Paid") {
      return "Ready to Schedule";
    }

    return "Pending Payment";
  };

  const getPackageAmount = (packageName?: string) => {
    switch (packageName) {
      case "Basic":
        return 224;

      case "Standard":
        return 450;

      case "Premium":
        return 750;

      default:
        return 0;
    }
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="p-8">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-700">
            Approved Members
          </h1>

          <p className="text-gray-600 mt-2">
            Applicants who have paid the $12 application fee and have been
            approved for membership.
          </p>
        </div>

        <button
          onClick={fetchApprovedApplications}
          disabled={loading}
          className="bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white px-5 py-3 rounded-lg font-semibold"
        >
          🔄 Refresh
        </button>
      </div>

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading ? (
        <div className="bg-white rounded-xl shadow p-8">
          <p className="text-gray-500">Loading approved members...</p>
        </div>
      ) : applications.length === 0 ? (
        /* ==================================================
           EMPTY STATE
           ================================================== */

        <div className="bg-white rounded-xl shadow p-8">
          <p className="text-gray-500">No approved members found.</p>
        </div>
      ) : (
        /* ==================================================
           MEMBERS
           ================================================== */

        <div className="space-y-6">
          {applications.map((app) => {
            const packageAmount = getPackageAmount(app.initiationPackage);

            const paymentStatus = getPaymentStatus(app);

            const paymentMethod = getPaymentMethod(app);

            const initiationStatus = getInitiationStatus(app);

            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* ==================================================
                      PHOTO
                      ================================================== */}

                  <div>
                    {app.photo ? (
                      <img
                        src={app.photo}
                        alt={app.fullName}
                        className="w-40 h-40 rounded-xl object-cover border-4 border-green-600"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500">
                        No Photo
                      </div>
                    )}
                  </div>

                  {/* ==================================================
                      MEMBER INFORMATION
                      ================================================== */}

                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <h2 className="text-2xl font-bold text-purple-900">
                        {app.fullName}
                      </h2>

                      <span className="inline-flex w-fit bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">
                        ✓ {app.status}
                      </span>
                    </div>

                    {/* ==================================================
                        BASIC DETAILS
                        ================================================== */}

                    <div className="grid md:grid-cols-2 gap-3 mt-5">
                      <p>
                        <strong>Email:</strong> {app.email}
                      </p>

                      <p>
                        <strong>Phone:</strong> {app.phone}
                      </p>

                      <p>
                        <strong>Occupation:</strong> {app.occupation}
                      </p>

                      <p>
                        <strong>State:</strong> {app.state}
                      </p>

                      <p>
                        <strong>City:</strong> {app.city || "N/A"}
                      </p>

                      <p>
                        <strong>Application Fee:</strong>{" "}
                        <span className="text-green-700 font-semibold">
                          ${(app.applicationFeeAmount || 12).toLocaleString()}{" "}
                          Paid
                        </span>
                      </p>
                    </div>

                    {/* ==================================================
                        INITIATION PAYMENT STATUS
                        ================================================== */}

                    <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-5">
                      <h3 className="text-lg font-bold text-purple-900 mb-4">
                        Initiation Payment
                      </h3>

                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Package</p>

                          <p className="font-bold text-gray-900">
                            {app.initiationPackage || "Not Selected"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Amount</p>

                          <p className="font-bold text-gray-900">
                            {app.paymentAmount
                              ? `$${app.paymentAmount.toLocaleString()}`
                              : packageAmount
                                ? `$${packageAmount.toLocaleString()}`
                                : "Not Selected"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Payment</p>

                          <p
                            className={`font-bold ${
                              paymentStatus === "Paid"
                                ? "text-green-700"
                                : "text-orange-600"
                            }`}
                          >
                            {paymentStatus}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Method</p>

                          <p className="font-bold text-gray-900">
                            {paymentMethod}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ==================================================
                        INITIATION STATUS
                        ================================================== */}

                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Initiation Status
                          </p>

                          <p className="font-bold text-gray-900">
                            {initiationStatus}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            Initiation Date
                          </p>

                          <p className="font-bold text-gray-900">
                            {app.initiationDate
                              ? new Date(
                                  app.initiationDate,
                                ).toLocaleDateString()
                              : "Not Set"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Venue</p>

                          <p className="font-bold text-gray-900">
                            {app.initiationVenue || "Not Set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ==================================================
                        ACTIONS
                        ================================================== */}

                    <div className="flex flex-wrap gap-4 mt-8">
                      <button
                        onClick={() => {
                          setSelectedMember(app);
                          setShowDetailsModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                      >
                        View Full Application
                      </button>

                      <button
                        onClick={() => resendEmail(app._id)}
                        disabled={resendingId === app._id}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-3 rounded-lg font-semibold"
                      >
                        {resendingId === app._id
                          ? "Sending..."
                          : "📧 Resend Approval Email"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================
          FULL APPLICATION MODAL
          ====================================================== */}

      {showDetailsModal && selectedMember && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-5">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            {/* ==================================================
                MODAL HEADER
                ================================================== */}

            <div className="bg-purple-900 text-white p-6 flex justify-between items-center sticky top-0">
              <h2 className="text-2xl font-bold">
                Full Membership Application
              </h2>

              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedMember(null);
                }}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>

            {/* ==================================================
                MODAL CONTENT
                ================================================== */}

            <div className="p-8 space-y-8">
              {/* ==================================================
                  PHOTOS
                  ================================================== */}

              <div className="flex flex-col md:flex-row gap-8">
                {selectedMember.photo && (
                  <div>
                    <p className="font-bold mb-2">Passport Photograph</p>

                    <img
                      src={selectedMember.photo}
                      alt={selectedMember.fullName}
                      className="w-48 h-48 rounded-xl object-cover border"
                    />
                  </div>
                )}

                {selectedMember.signature && (
                  <div>
                    <p className="font-bold mb-2">Signature</p>

                    <img
                      src={selectedMember.signature}
                      alt="Applicant signature"
                      className="w-48 h-32 object-contain border rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* ==================================================
                  PERSONAL INFORMATION
                  ================================================== */}

              <div>
                <h3 className="text-xl font-bold text-purple-900 mb-4">
                  Personal Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <p>
                    <strong>Name:</strong> {selectedMember.fullName}
                  </p>

                  <p>
                    <strong>Email:</strong> {selectedMember.email}
                  </p>

                  <p>
                    <strong>Phone:</strong> {selectedMember.phone}
                  </p>

                  <p>
                    <strong>Gender:</strong> {selectedMember.gender || "N/A"}
                  </p>

                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {selectedMember.dateOfBirth
                      ? new Date(
                          selectedMember.dateOfBirth,
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <p>
                    <strong>Marital Status:</strong>{" "}
                    {selectedMember.maritalStatus || "N/A"}
                  </p>

                  <p>
                    <strong>Occupation:</strong> {selectedMember.occupation}
                  </p>

                  <p>
                    <strong>Country:</strong> {selectedMember.country || "N/A"}
                  </p>

                  <p>
                    <strong>State:</strong> {selectedMember.state}
                  </p>

                  <p>
                    <strong>City:</strong> {selectedMember.city || "N/A"}
                  </p>

                  <p>
                    <strong>Address:</strong> {selectedMember.address || "N/A"}
                  </p>
                </div>
              </div>

              {/* ==================================================
                  NEXT OF KIN
                  ================================================== */}

              <div>
                <h3 className="text-xl font-bold text-purple-900 mb-4">
                  Next of Kin
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <p>
                    <strong>Name:</strong> {selectedMember.nextOfKin || "N/A"}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedMember.nextOfKinPhone || "N/A"}
                  </p>
                </div>
              </div>

              {/* ==================================================
                  MEMBERSHIP INFORMATION
                  ================================================== */}

              <div>
                <h3 className="text-xl font-bold text-purple-900 mb-4">
                  Membership Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <p>
                    <strong>Reason for Joining:</strong>{" "}
                    {selectedMember.reason || "N/A"}
                  </p>

                  <p>
                    <strong>Referred By:</strong>{" "}
                    {selectedMember.referredBy || "N/A"}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="text-green-700 font-bold">
                      {selectedMember.status}
                    </span>
                  </p>

                  <p>
                    <strong>Application Fee:</strong>{" "}
                    <span className="text-green-700 font-bold">
                      $
                      {(
                        selectedMember.applicationFeeAmount || 12
                      ).toLocaleString()}{" "}
                      Paid
                    </span>
                  </p>
                </div>
              </div>

              {/* ==================================================
                  INITIATION PAYMENT
                  ================================================== */}

              <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-purple-900 mb-4">
                  Initiation Payment
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <p>
                    <strong>Package:</strong>{" "}
                    {selectedMember.initiationPackage || "Not Selected"}
                  </p>

                  <p>
                    <strong>Amount:</strong>{" "}
                    {selectedMember.paymentAmount
                      ? `$${selectedMember.paymentAmount.toLocaleString()}`
                      : "Pending"}
                  </p>

                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <span
                      className={
                        selectedMember.paymentStatus === "Paid"
                          ? "text-green-700 font-bold"
                          : "text-orange-600 font-bold"
                      }
                    >
                      {selectedMember.paymentStatus || "Pending"}
                    </span>
                  </p>

                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {getPaymentMethod(selectedMember)}
                  </p>

                  <p>
                    <strong>Payment Reference:</strong>{" "}
                    {selectedMember.paymentReference || "Not Available"}
                  </p>

                  <p>
                    <strong>Payment Date:</strong>{" "}
                    {selectedMember.paymentDate
                      ? new Date(
                          selectedMember.paymentDate,
                        ).toLocaleDateString()
                      : "Not Paid"}
                  </p>
                </div>
              </div>

              {/* ==================================================
                  INITIATION SCHEDULE
                  ================================================== */}

              <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  Initiation Schedule
                </h3>

                <div className="space-y-3">
                  <p>
                    <strong>Initiation Status:</strong>{" "}
                    {selectedMember.initiationStatus || "Pending"}
                  </p>

                  <p>
                    <strong>Initiation Date:</strong>{" "}
                    {selectedMember.initiationDate
                      ? new Date(
                          selectedMember.initiationDate,
                        ).toLocaleDateString()
                      : "Not Set"}
                  </p>

                  <p>
                    <strong>Initiation Time:</strong>{" "}
                    {selectedMember.initiationTime || "Not Set"}
                  </p>

                  <p>
                    <strong>Initiation Venue:</strong>{" "}
                    {selectedMember.initiationVenue || "Not Set"}
                  </p>

                  <p>
                    <strong>Instructions:</strong>{" "}
                    {selectedMember.initiationInstructions || "Not Set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedMembers;
