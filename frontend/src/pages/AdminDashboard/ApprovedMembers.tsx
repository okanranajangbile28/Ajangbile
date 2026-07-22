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

  initiationDate?: string;
  initiationTime?: string;
  initiationVenue?: string;
  initiationInstructions?: string;
  initiationFee?: number;
}

const ApprovedMembers = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMember, setSelectedMember] = useState<Application | null>(
    null,
  );

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchApprovedApplications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/approved`,
      );

      setApplications(res.data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedApplications();
  }, []);

  const resendEmail = async (id: string) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/approve/${id}`,
      );

      alert("Approval email sent successfully.");
    } catch (err) {
      console.error(err);
      alert("Unable to send approval email.");
    }
  };

  const markAsPaid = async (id: string) => {
    if (!window.confirm("Mark this member as Paid?")) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/mark-paid/${id}`,
      );

      await fetchApprovedApplications();

      alert("Member marked as Paid.");
    } catch (err) {
      console.error(err);
      alert("Unable to mark member as Paid.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-8">
        Approved Members
      </h1>

      {loading ? (
        <p>Loading approved members...</p>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8">
          <p className="text-gray-500">No approved members found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div>
                  {app.photo ? (
                    <img
                      src={app.photo}
                      alt={app.fullName}
                      className="w-40 h-40 rounded-xl object-cover border-4 border-green-600"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-xl bg-gray-200 flex items-center justify-center">
                      No Photo
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-purple-900 mb-4">
                    {app.fullName}
                  </h2>

                  <div className="grid md:grid-cols-2 gap-3">
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
                      <strong>Status:</strong>{" "}
                      <span className="text-green-700 font-bold">
                        {app.status}
                      </span>
                    </p>
                  </div>

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
                      onClick={() => markAsPaid(app._id)}
                      className="bg-purple-900 hover:bg-purple-800 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                      ✅ Mark As Paid
                    </button>

                    <button
                      onClick={() => resendEmail(app._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                      Resend Approval Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDetailsModal && selectedMember && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-5">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <div className="bg-purple-900 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                Full Membership Application
              </h2>

              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedMember(null);
                }}
                className="bg-red-600 px-5 py-2 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <img
                  src={selectedMember.photo}
                  className="w-48 h-48 rounded-xl object-cover border"
                />

                {selectedMember.signature && (
                  <img
                    src={selectedMember.signature}
                    className="w-48 h-32 object-contain border"
                  />
                )}
              </div>

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
                  <strong>Occupation:</strong> {selectedMember.occupation}
                </p>
                <p>
                  <strong>Address:</strong> {selectedMember.address || "N/A"}
                </p>
                <p>
                  <strong>Next Of Kin:</strong>{" "}
                  {selectedMember.nextOfKin || "N/A"}
                </p>
                <p>
                  <strong>Reason:</strong> {selectedMember.reason || "N/A"}
                </p>
              </div>

              <div className="bg-green-50 p-5 rounded-xl space-y-2">
                <p>
                  <strong>Status:</strong> {selectedMember.status}
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
                  <strong>Initiation Fee:</strong> ₦
                  {(selectedMember.initiationFee ?? 50000).toLocaleString()}
                </p>

                <p>
                  <strong>Instructions:</strong>{" "}
                  {selectedMember.initiationInstructions || "Not Set"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedMembers;
