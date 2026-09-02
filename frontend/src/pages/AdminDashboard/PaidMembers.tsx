import { useCallback, useEffect, useState } from "react";
import axios from "axios";

interface Application {
  _id: string;

  fullName: string;
  email: string;
  phone: string;

  gender?: string;
  dateOfBirth?: string;
  maritalStatus?: string;

  country?: string;
  state?: string;
  city?: string;
  address?: string;

  occupation?: string;

  nextOfKin?: string;
  nextOfKinPhone?: string;

  reason?: string;

  previousInstitution?: boolean;
  institutionName?: string;
  referredBy?: string;

  photo?: string;
  signature?: string;

  declarationAccepted?: boolean;
  ndaAccepted?: boolean;

  status: string;

  adminNotes?: string;

  paymentStatus?: string;
  paymentAmount?: number;
  paymentReference?: string;
  paymentDate?: string;

  initiationPackage?: string;

  initiationStatus?: "Pending" | "Scheduled" | "Completed";

  initiationDate?: string;
  initiationTime?: string;
  initiationVenue?: string;
  initiationInstructions?: string;
}

interface ApiError {
  message?: string;
}

const PaidMembers = () => {
  const [members, setMembers] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMember, setSelectedMember] = useState<Application | null>(
    null,
  );

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const [formData, setFormData] = useState({
    initiationDate: "",
    initiationTime: "",
    initiationVenue: "",
    initiationInstructions: "",
  });

  // ======================================================
  // FETCH PAID MEMBERS
  // ======================================================

  const fetchPaidMembers = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/paid`,
        {
          withCredentials: true,
        },
      );

      setMembers(res.data.applications || []);
    } catch (err: unknown) {
      console.error("Error fetching paid members:", err);

      if (axios.isAxiosError<ApiError>(err)) {
        console.error(
          err.response?.data?.message || "Unable to load paid members.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================================================
  // LOAD PAID MEMBERS
  // ======================================================

  useEffect(() => {
    void fetchPaidMembers();
  }, [fetchPaidMembers]);

  // ======================================================
  // OPEN FULL APPLICATION
  // ======================================================

  const openApplicationModal = (member: Application) => {
    setSelectedMember(member);
    setShowApplicationModal(true);
  };

  // ======================================================
  // OPEN SCHEDULE MODAL
  // ======================================================

  const openScheduleModal = (member: Application) => {
    setSelectedMember(member);

    setFormData({
      initiationDate: member.initiationDate
        ? new Date(member.initiationDate).toISOString().split("T")[0]
        : "",

      initiationTime: member.initiationTime || "",

      initiationVenue: member.initiationVenue || "",

      initiationInstructions: member.initiationInstructions || "",
    });

    setShowScheduleModal(true);
  };

  // ======================================================
  // SCHEDULE & SEND INITIATION EMAIL
  // ======================================================

  const scheduleAndSendInitiation = async () => {
    if (!selectedMember) {
      return;
    }

    if (!formData.initiationDate) {
      alert("Please select the initiation date.");
      return;
    }

    if (!formData.initiationTime) {
      alert("Please select the initiation time.");
      return;
    }

    if (!formData.initiationVenue.trim()) {
      alert("Please enter the initiation venue.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/schedule-initiation/${selectedMember._id}`,
        formData,
        {
          withCredentials: true,
        },
      );

      alert("Initiation email sent successfully.");

      setShowScheduleModal(false);
      setSelectedMember(null);

      setFormData({
        initiationDate: "",
        initiationTime: "",
        initiationVenue: "",
        initiationInstructions: "",
      });

      await fetchPaidMembers();
    } catch (err: unknown) {
      console.error("Error scheduling initiation:", err);

      if (axios.isAxiosError<ApiError>(err)) {
        alert(err.response?.data?.message || "Unable to schedule initiation.");
      } else {
        alert("Unable to schedule initiation.");
      }
    }
  };

  // ======================================================
  // RESEND INITIATION EMAIL
  // ======================================================

  const resendInitiationEmail = async (memberId: string) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/resend-initiation-email/${memberId}`,
        {},
        {
          withCredentials: true,
        },
      );

      alert("Initiation email resent successfully.");
    } catch (err: unknown) {
      console.error("Error resending initiation email:", err);

      if (axios.isAxiosError<ApiError>(err)) {
        alert(
          err.response?.data?.message || "Unable to resend initiation email.",
        );
      } else {
        alert("Unable to resend initiation email.");
      }
    }
  };

  // ======================================================
  // CLOSE SCHEDULE MODAL
  // ======================================================

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedMember(null);

    setFormData({
      initiationDate: "",
      initiationTime: "",
      initiationVenue: "",
      initiationInstructions: "",
    });
  };

  // ======================================================
  // CLOSE APPLICATION MODAL
  // ======================================================

  const closeApplicationModal = () => {
    setShowApplicationModal(false);
    setSelectedMember(null);
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg text-gray-600">Loading paid members...</div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="p-4 md:p-8">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-900">Paid Members</h1>

        <p className="mt-2 text-gray-500">
          Members who have completed their initiation payment.
        </p>
      </div>

      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {members.length === 0 ? (
        <div className="rounded-xl bg-white p-8 shadow">
          <p className="text-gray-500">No paid members yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {members.map((member) => (
            <div
              key={member._id}
              className="rounded-2xl border bg-white p-6 shadow-lg"
            >
              <div className="flex flex-col gap-6 md:flex-row">
                {/* ==================================================
                    PHOTO
                ================================================== */}

                <div>
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.fullName}
                      className="h-36 w-36 rounded-xl border-4 border-purple-900 object-cover"
                    />
                  ) : (
                    <div className="flex h-36 w-36 items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500">
                      No Photo
                    </div>
                  )}
                </div>

                {/* ==================================================
                    MEMBER INFORMATION
                ================================================== */}

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-purple-900">
                    {member.fullName}
                  </h2>

                  <p className="mt-2">
                    <strong>Email:</strong> {member.email}
                  </p>

                  <p>
                    <strong>Phone:</strong> {member.phone}
                  </p>

                  <p>
                    <strong>Occupation:</strong> {member.occupation || "-"}
                  </p>

                  <p>
                    <strong>State:</strong> {member.state || "-"}
                  </p>

                  <p>
                    <strong>City:</strong> {member.city || "-"}
                  </p>

                  {/* PAYMENT STATUS */}

                  <p className="mt-3">
                    <strong>Payment Status:</strong>{" "}
                    <span className="font-bold text-green-700">
                      {member.paymentStatus || member.status}
                    </span>
                  </p>

                  {/* PAYMENT AMOUNT */}

                  <p>
                    <strong>Payment Amount:</strong>{" "}
                    <span className="font-semibold text-gray-800">
                      ₦
                      {member.paymentAmount
                        ? member.paymentAmount.toLocaleString()
                        : "-"}
                    </span>
                  </p>

                  {/* INITIATION STATUS */}

                  <p>
                    <strong>Initiation Status:</strong>{" "}
                    <span
                      className={
                        member.initiationStatus === "Scheduled"
                          ? "font-bold text-purple-700"
                          : "font-bold text-orange-600"
                      }
                    >
                      {member.initiationStatus || "Pending"}
                    </span>
                  </p>

                  {/* ==================================================
                      ACTION BUTTONS
                  ================================================== */}

                  <div className="mt-6 flex flex-wrap gap-4">
                    <button
                      type="button"
                      onClick={() => openApplicationModal(member)}
                      className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
                    >
                      View Full Application
                    </button>

                    {member.initiationStatus !== "Scheduled" ? (
                      <button
                        type="button"
                        onClick={() => openScheduleModal(member)}
                        className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
                      >
                        Schedule & Send Initiation
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => resendInitiationEmail(member._id)}
                        className="rounded-lg bg-purple-700 px-6 py-3 font-semibold text-white transition hover:bg-purple-800"
                      >
                        Resend Initiation Email
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================
          SCHEDULE INITIATION MODAL
      ====================================================== */}

      {showScheduleModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="mb-6 text-3xl font-bold text-purple-900">
              Schedule & Send Initiation
            </h2>

            <p className="mb-6 text-gray-600">
              Scheduling initiation for{" "}
              <strong>{selectedMember.fullName}</strong>
            </p>

            <div className="space-y-5">
              {/* DATE */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Initiation Date
                </label>

                <input
                  type="date"
                  className="w-full rounded-lg border p-3"
                  value={formData.initiationDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      initiationDate: e.target.value,
                    })
                  }
                />
              </div>

              {/* TIME */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Initiation Time
                </label>

                <input
                  type="time"
                  className="w-full rounded-lg border p-3"
                  value={formData.initiationTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      initiationTime: e.target.value,
                    })
                  }
                />
              </div>

              {/* VENUE */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Initiation Venue
                </label>

                <input
                  type="text"
                  placeholder="e.g. Iledi Ajangbile"
                  className="w-full rounded-lg border p-3"
                  value={formData.initiationVenue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      initiationVenue: e.target.value,
                    })
                  }
                />
              </div>

              {/* INSTRUCTIONS */}

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Initiation Instructions
                </label>

                <textarea
                  rows={5}
                  placeholder="Enter any instructions the applicant should know..."
                  className="w-full rounded-lg border p-3"
                  value={formData.initiationInstructions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      initiationInstructions: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* ==================================================
                MODAL BUTTONS
            ================================================== */}

            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={closeScheduleModal}
                className="rounded-lg bg-gray-300 px-6 py-3 transition hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  void scheduleAndSendInitiation();
                }}
                className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                Send Initiation Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          FULL APPLICATION MODAL
      ====================================================== */}

      {showApplicationModal && selectedMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70">
          <div className="mx-auto my-10 w-full max-w-5xl rounded-2xl bg-white p-5 shadow-2xl md:p-8">
            {/* HEADER */}

            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-purple-900 md:text-3xl">
                Membership Application
              </h2>

              <button
                type="button"
                onClick={closeApplicationModal}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
              >
                ← Back
              </button>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* ==================================================
                  PHOTO / SIGNATURE
              ================================================== */}

              <div>
                {selectedMember.photo ? (
                  <img
                    src={selectedMember.photo}
                    alt={selectedMember.fullName}
                    className="w-full rounded-xl border-4 border-purple-900 object-cover"
                  />
                ) : (
                  <div className="flex h-80 w-full items-center justify-center rounded-xl border-4 border-purple-900 bg-gray-200 font-semibold text-gray-600">
                    No Passport Photo
                  </div>
                )}

                <p className="mt-4 font-bold text-purple-900">
                  Passport Photograph
                </p>

                {selectedMember.signature ? (
                  <>
                    <img
                      src={selectedMember.signature}
                      alt="Signature"
                      className="mt-6 w-full rounded-lg border"
                    />

                    <p className="mt-2 font-bold text-purple-900">Signature</p>
                  </>
                ) : (
                  <div className="mt-6 flex h-32 w-full items-center justify-center rounded-lg border bg-gray-200 font-semibold text-gray-600">
                    No Signature
                  </div>
                )}
              </div>

              {/* ==================================================
                  APPLICATION DETAILS
              ================================================== */}

              <div className="space-y-3 md:col-span-2">
                <p>
                  <strong>Full Name:</strong> {selectedMember.fullName}
                </p>

                <p>
                  <strong>Email:</strong> {selectedMember.email}
                </p>

                <p>
                  <strong>Phone:</strong> {selectedMember.phone}
                </p>

                <hr />

                <p>
                  <strong>Gender:</strong> {selectedMember.gender || "-"}
                </p>

                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {selectedMember.dateOfBirth
                    ? new Date(selectedMember.dateOfBirth).toLocaleDateString()
                    : "-"}
                </p>

                <p>
                  <strong>Marital Status:</strong>{" "}
                  {selectedMember.maritalStatus || "-"}
                </p>

                <hr />

                <p>
                  <strong>Country:</strong> {selectedMember.country || "-"}
                </p>

                <p>
                  <strong>State:</strong> {selectedMember.state || "-"}
                </p>

                <p>
                  <strong>City:</strong> {selectedMember.city || "-"}
                </p>

                <p>
                  <strong>Address:</strong> {selectedMember.address || "-"}
                </p>

                <hr />

                <p>
                  <strong>Occupation:</strong>{" "}
                  {selectedMember.occupation || "-"}
                </p>

                <hr />

                <p>
                  <strong>Next of Kin:</strong>{" "}
                  {selectedMember.nextOfKin || "-"}
                </p>

                <p>
                  <strong>Next of Kin Phone:</strong>{" "}
                  {selectedMember.nextOfKinPhone || "-"}
                </p>

                <hr />

                <p>
                  <strong>Reason for Joining:</strong>
                </p>

                <div className="rounded-lg bg-gray-100 p-4">
                  {selectedMember.reason || "-"}
                </div>

                <hr />

                <p>
                  <strong>Previous Institution:</strong>{" "}
                  {selectedMember.previousInstitution ? "Yes" : "No"}
                </p>

                {selectedMember.previousInstitution && (
                  <p>
                    <strong>Institution Name:</strong>{" "}
                    {selectedMember.institutionName || "-"}
                  </p>
                )}

                <p>
                  <strong>Referred By:</strong>{" "}
                  {selectedMember.referredBy || "-"}
                </p>

                <hr />

                <p>
                  <strong>Declaration Accepted:</strong>{" "}
                  {selectedMember.declarationAccepted ? "Yes" : "No"}
                </p>

                <p>
                  <strong>NDA Accepted:</strong>{" "}
                  {selectedMember.ndaAccepted ? "Yes" : "No"}
                </p>

                <hr />

                {/* ==================================================
                    PAYMENT INFORMATION
                ================================================== */}

                <h3 className="text-xl font-bold text-purple-900">
                  Payment Information
                </h3>

                <p>
                  <strong>Payment Status:</strong>{" "}
                  {selectedMember.paymentStatus || "-"}
                </p>

                <p>
                  <strong>Amount:</strong>{" "}
                  {selectedMember.paymentAmount
                    ? `₦${selectedMember.paymentAmount.toLocaleString()}`
                    : "-"}
                </p>

                <p>
                  <strong>Reference:</strong>{" "}
                  {selectedMember.paymentReference || "-"}
                </p>

                <p>
                  <strong>Payment Date:</strong>{" "}
                  {selectedMember.paymentDate
                    ? new Date(selectedMember.paymentDate).toLocaleString()
                    : "-"}
                </p>

                <hr />

                {/* ==================================================
                    INITIATION INFORMATION
                ================================================== */}

                <h3 className="text-xl font-bold text-purple-900">
                  Initiation
                </h3>

                <p>
                  <strong>Package:</strong>{" "}
                  {selectedMember.initiationPackage || "-"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {selectedMember.initiationStatus || "Pending"}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {selectedMember.initiationDate
                    ? new Date(
                        selectedMember.initiationDate,
                      ).toLocaleDateString()
                    : "-"}
                </p>

                <p>
                  <strong>Time:</strong> {selectedMember.initiationTime || "-"}
                </p>

                <p>
                  <strong>Venue:</strong>{" "}
                  {selectedMember.initiationVenue || "-"}
                </p>

                <p>
                  <strong>Instructions:</strong>
                </p>

                <div className="rounded-lg border bg-yellow-50 p-4">
                  {selectedMember.initiationInstructions || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaidMembers;
