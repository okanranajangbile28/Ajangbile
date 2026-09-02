import { useEffect, useState } from "react";

interface Application {
  _id: string;

  fullName: string;
  email: string;
  phone: string;

  gender: string;
  dateOfBirth: string;
  maritalStatus: string;

  country: string;
  state: string;
  city: string;
  address: string;

  occupation: string;

  nextOfKin: string;
  nextOfKinPhone: string;

  reason: string;

  previousInstitution: boolean;
  institutionName?: string;

  photo: string;
  signature: string;

  declarationAccepted: boolean;
  ndaAccepted: boolean;

  status:
    | "Payment Pending"
    | "Pending"
    | "Interview Scheduled"
    | "Initiation Scheduled"
    | "Accepted"
    | "Rejected"
    | "Completed"
    | "Paid";

  applicationFeeStatus?: "Pending" | "Paid";
  applicationFeeAmount?: number;
  applicationFeeReference?: string;
  applicationFeeDate?: string;
  applicationFeePaymentMethod?: "stripe" | "bank_transfer";

  adminNotes?: string;

  createdAt: string;
}

const statuses: Application["status"][] = [
  "Payment Pending",
  "Pending",
  "Interview Scheduled",
  "Initiation Scheduled",
  "Accepted",
  "Rejected",
  "Completed",
  "Paid",
];

const MembershipApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Application | null>(null);

  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // ======================================================
  // FETCH APPLICATIONS
  // ======================================================

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications`,
      );

      const data = await response.json();

      if (data.success) {
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error(error);

      alert("Failed to load membership applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // ======================================================
  // VERIFY BANK TRANSFER
  // ======================================================

  const verifyBankTransfer = async (id: string) => {
    const confirmVerification = window.confirm(
      "Confirm that you have received the $12 application fee by bank transfer?",
    );

    if (!confirmVerification) return;

    try {
      setVerifyingId(id);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/verify-application-fee-transfer/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Unable to verify bank transfer.");
        return;
      }

      alert("Bank transfer verified successfully.");

      setSelected(null);

      await fetchApplications();
    } catch (error) {
      console.error("Bank transfer verification error:", error);

      alert("Could not verify bank transfer.");
    } finally {
      setVerifyingId(null);
    }
  };

  // ======================================================
  // UPDATE APPLICATION STATUS
  // ======================================================

  const updateStatus = async (id: string, status: Application["status"]) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        alert("Application status updated.");

        fetchApplications();
      }
    } catch (error) {
      console.error(error);

      alert("Could not update status.");
    }
  };

  // ======================================================
  // DELETE APPLICATION
  // ======================================================

  const deleteApplication = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (data.success) {
        alert("Application deleted.");

        setSelected(null);

        fetchApplications();
      }
    } catch (error) {
      console.error(error);

      alert("Delete failed.");
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading membership applications...
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-950">
          Membership Applications
        </h1>

        <p className="text-gray-600 mt-2">
          Review and manage new membership applications and verify application
          fee payments.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-950 text-white">
              <tr>
                <th className="p-4 text-left">Applicant</th>

                <th className="p-4 text-left">Contact</th>

                <th className="p-4 text-left">Application Fee</th>

                <th className="p-4 text-left">Status</th>

                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No membership applications found.
                  </td>
                </tr>
              ) : (
                applications.map((application) => {
                  const isBankTransfer =
                    application.applicationFeePaymentMethod === "bank_transfer";

                  const isAwaitingVerification =
                    isBankTransfer &&
                    application.applicationFeeStatus !== "Paid";

                  return (
                    <tr key={application._id} className="border-b">
                      {/* APPLICANT */}

                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={application.photo}
                            className="w-14 h-14 rounded-full object-cover"
                            alt={application.fullName}
                          />

                          <div>
                            <p className="font-bold">{application.fullName}</p>

                            <p className="text-sm text-gray-500">
                              {application.occupation}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}

                      <td className="p-4">
                        <p>{application.email}</p>

                        <p>{application.phone}</p>
                      </td>

                      {/* APPLICATION FEE */}

                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="font-semibold">
                            $
                            {(application.applicationFeeAmount ?? 12).toFixed(
                              2,
                            )}
                          </p>

                          {isBankTransfer ? (
                            <>
                              <span className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold">
                                Bank Transfer
                              </span>

                              {application.applicationFeeStatus === "Paid" ? (
                                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold ml-1">
                                  Verified
                                </span>
                              ) : (
                                <p className="text-xs text-orange-600 font-medium">
                                  Awaiting verification
                                </p>
                              )}

                              {application.applicationFeeReference && (
                                <p className="text-xs text-gray-600">
                                  Ref: {application.applicationFeeReference}
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                                Stripe
                              </span>

                              {application.applicationFeeStatus === "Paid" && (
                                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold ml-1">
                                  Paid
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="p-4">
                        <select
                          value={application.status}
                          onChange={(e) =>
                            updateStatus(
                              application._id,
                              e.target.value as Application["status"],
                            )
                          }
                          className="border rounded-lg p-2"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* ACTIONS */}

                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelected(application)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            View
                          </button>

                          {isAwaitingVerification && (
                            <button
                              onClick={() =>
                                verifyBankTransfer(application._id)
                              }
                              disabled={verifyingId === application._id}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                            >
                              {verifyingId === application._id
                                ? "Verifying..."
                                : "Verify Bank Transfer"}
                            </button>
                          )}

                          <button
                            onClick={() => deleteApplication(application._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================
          APPLICANT DETAILS MODAL
          ====================================================== */}

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-purple-950">
                Applicant Details
              </h2>

              <button
                onClick={() => setSelected(null)}
                className="text-red-600 font-bold"
              >
                Close
              </button>
            </div>

            {/* PHOTOS */}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold mb-2">Passport Photograph</p>

                <img
                  src={selected.photo}
                  className="rounded-xl w-full"
                  alt="Passport"
                />
              </div>

              <div>
                <p className="font-semibold mb-2">Signature</p>

                <img
                  src={selected.signature}
                  className="rounded-xl w-full border"
                  alt="Signature"
                />
              </div>
            </div>

            {/* DETAILS */}

            <div className="mt-8 space-y-4">
              <p>
                <b>Name:</b> {selected.fullName}
              </p>

              <p>
                <b>Email:</b> {selected.email}
              </p>

              <p>
                <b>Phone:</b> {selected.phone}
              </p>

              <p>
                <b>Gender:</b> {selected.gender}
              </p>

              <p>
                <b>Date of Birth:</b> {selected.dateOfBirth}
              </p>

              <p>
                <b>Marital Status:</b> {selected.maritalStatus}
              </p>

              <p>
                <b>Country:</b> {selected.country}
              </p>

              <p>
                <b>State:</b> {selected.state}
              </p>

              <p>
                <b>City:</b> {selected.city}
              </p>

              <p>
                <b>Address:</b> {selected.address}
              </p>

              <p>
                <b>Occupation:</b> {selected.occupation}
              </p>

              <p>
                <b>Next of Kin:</b> {selected.nextOfKin}
              </p>

              <p>
                <b>Next of Kin Phone:</b> {selected.nextOfKinPhone}
              </p>

              {/* APPLICATION FEE */}

              <div className="border rounded-2xl p-5 bg-gray-50">
                <h3 className="text-xl font-bold text-purple-950 mb-4">
                  Application Fee Payment
                </h3>

                <div className="space-y-2">
                  <p>
                    <b>Amount:</b> $
                    {(selected.applicationFeeAmount ?? 12).toFixed(2)}
                  </p>

                  <p>
                    <b>Payment Method:</b>{" "}
                    {selected.applicationFeePaymentMethod === "bank_transfer"
                      ? "Bank Transfer"
                      : "Stripe"}
                  </p>

                  <p>
                    <b>Payment Status:</b>{" "}
                    {selected.applicationFeeStatus || "Pending"}
                  </p>

                  {selected.applicationFeeReference && (
                    <p>
                      <b>Reference:</b> {selected.applicationFeeReference}
                    </p>
                  )}

                  {selected.applicationFeeDate && (
                    <p>
                      <b>Payment Date:</b>{" "}
                      {new Date(selected.applicationFeeDate).toLocaleString()}
                    </p>
                  )}
                </div>

                {selected.applicationFeePaymentMethod === "bank_transfer" &&
                  selected.applicationFeeStatus !== "Paid" && (
                    <button
                      onClick={() => verifyBankTransfer(selected._id)}
                      disabled={verifyingId === selected._id}
                      className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50"
                    >
                      {verifyingId === selected._id
                        ? "Verifying..."
                        : "Verify Bank Transfer"}
                    </button>
                  )}
              </div>

              {/* REASON */}

              <div>
                <p className="font-bold mb-2">Reason for joining:</p>

                <p className="bg-gray-100 p-4 rounded-xl">{selected.reason}</p>
              </div>

              {/* DECLARATION */}

              <p>
                <b>Declaration:</b>{" "}
                {selected.declarationAccepted ? "Accepted" : "Not accepted"}
              </p>

              {/* NDA */}

              <p>
                <b>Confidentiality Agreement:</b>{" "}
                {selected.ndaAccepted ? "Accepted" : "Not accepted"}
              </p>

              {/* CLOSE */}

              <div className="pt-4 border-t">
                <button
                  onClick={() => setSelected(null)}
                  className="bg-purple-950 hover:bg-purple-900 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Close Applicant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipApplications;
