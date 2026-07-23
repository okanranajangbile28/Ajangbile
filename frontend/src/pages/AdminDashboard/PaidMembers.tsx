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

  const fetchPaidMembers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/paid`,
      );

      setMembers(res.data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaidMembers();
  }, []);

  const openApplicationModal = (member: Application) => {
    setSelectedMember(member);
    setShowApplicationModal(true);
  };

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

  const scheduleAndSendInitiation = async () => {
    if (!selectedMember) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/schedule-initiation/${selectedMember._id}`,
        formData,
      );

      alert("Initiation email sent successfully.");

      setShowScheduleModal(false);
      setSelectedMember(null);

      fetchPaidMembers();
    } catch (err) {
      console.error(err);
      alert("Unable to schedule initiation.");
    }
  };

  const resendInitiationEmail = async (memberId: string) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/resend-initiation-email/${memberId}`,
      );

      alert("Initiation email resent successfully.");
    } catch (err) {
      console.error(err);
      alert("Unable to resend initiation email.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-purple-900 mb-8">Paid Members</h1>

      {loading ? (
        <p>Loading paid members...</p>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8">
          <p className="text-gray-500">No paid members yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {members.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-2xl shadow-lg border p-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div>
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.fullName}
                      className="w-36 h-36 rounded-xl object-cover border-4 border-purple-900"
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-xl bg-gray-200 flex items-center justify-center">
                      No Photo
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-purple-900">
                    {member.fullName}
                  </h2>

                  <p>
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

                  <p className="mt-3">
                    <strong>Payment Status:</strong>{" "}
                    <span className="text-green-700 font-bold">
                      {member.status}
                    </span>
                  </p>

                  <p>
                    <strong>Initiation Status:</strong>{" "}
                    <span
                      className={
                        member.initiationStatus === "Scheduled"
                          ? "text-purple-700 font-bold"
                          : "text-orange-600 font-bold"
                      }
                    >
                      {member.initiationStatus || "Pending"}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-4 mt-6">
                    <button
                      onClick={() => openApplicationModal(member)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                      View Full Application
                    </button>

                    {member.initiationStatus !== "Scheduled" ? (
                      <button
                        onClick={() => openScheduleModal(member)}
                        className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold"
                      >
                        Schedule & Send Initiation
                      </button>
                    ) : (
                      <button
                        onClick={() => resendInitiationEmail(member._id)}
                        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-semibold"
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

      {showScheduleModal && selectedMember && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-purple-900 mb-6">
              Schedule & Send Initiation
            </h2>

            <div className="space-y-5">
              <input
                type="date"
                className="w-full border rounded-lg p-3"
                value={formData.initiationDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    initiationDate: e.target.value,
                  })
                }
              />

              <input
                type="time"
                className="w-full border rounded-lg p-3"
                value={formData.initiationTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    initiationTime: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Initiation Venue"
                className="w-full border rounded-lg p-3"
                value={formData.initiationVenue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    initiationVenue: e.target.value,
                  })
                }
              />

              <textarea
                rows={5}
                placeholder="Initiation Instructions"
                className="w-full border rounded-lg p-3"
                value={formData.initiationInstructions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    initiationInstructions: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedMember(null);

                  setFormData({
                    initiationDate: "",
                    initiationTime: "",
                    initiationVenue: "",
                    initiationInstructions: "",
                  });
                }}
                className="bg-gray-300 px-6 py-3 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={scheduleAndSendInitiation}
                className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Send Initiation Email
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ====================================================== */}
      {/* FULL APPLICATION MODAL */}
      {/* ====================================================== */}

      {showApplicationModal && selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-auto my-10 p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-purple-900">
                Membership Application
              </h2>

              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  setSelectedMember(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
              >
                ← Back to Paid Members
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div>
                {selectedMember.photo ? (
                  <img
                    src={selectedMember.photo}
                    alt={selectedMember.fullName}
                    className="w-full rounded-xl border-4 border-purple-900"
                  />
                ) : (
                  <div className="w-full h-80 rounded-xl border-4 border-purple-900 bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
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
                      className="w-full mt-6 border rounded-lg"
                    />

                    <p className="font-bold text-purple-900 mt-2">Signature</p>
                  </>
                ) : (
                  <div className="mt-6 w-full h-32 border rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                    No Signature
                  </div>
                )}
              </div>

              <div className="md:col-span-2 space-y-3">
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
                  <strong>Reason:</strong>
                </p>

                <div className="bg-gray-100 rounded-lg p-4">
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
                    {selectedMember.institutionName}
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

                <h3 className="text-xl font-bold text-purple-900">
                  Payment Information
                </h3>

                <p>
                  <strong>Payment Status:</strong>{" "}
                  {selectedMember.paymentStatus || "-"}
                </p>

                <p>
                  <strong>Amount:</strong> ₦
                  {selectedMember.paymentAmount?.toLocaleString() || "-"}
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

                <div className="bg-yellow-50 border rounded-lg p-4">
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
