import { useEffect, useState } from "react";
import axios from "axios";

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
  state: string;
  city: string;
  photo: string;
  createdAt: string;
}

const PendingApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState("");

  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [approvalForm] = useState({});

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/pending`,
      );

      setApplications(res.data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openApprovalModal = (id: string) => {
    setSelectedId(id);

    setShowApprovalModal(true);
  };

  const approveApplication = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/approve/${selectedId}`,
        approvalForm,
      );

      setShowApprovalModal(false);

      setSelectedId("");

      await fetchApplications();

      alert("Application approved successfully.");
    } catch (err) {
      console.error(err);
      alert("Unable to approve application.");
    }
  };

  const rejectApplication = async (id: string) => {
    if (!window.confirm("Reject this application?")) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/reject/${id}`,
      );

      await fetchApplications();

      alert("Application rejected.");
    } catch (err) {
      console.error(err);
      alert("Unable to reject application.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-purple-900 mb-8">
        Pending Applications
      </h1>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8">
          <p className="text-gray-500">No pending applications found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl shadow-lg border p-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div>
                  {app.photo ? (
                    <img
                      src={app.photo}
                      alt={app.fullName}
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
                    {app.fullName}
                  </h2>

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
                    <strong>City:</strong> {app.city}
                  </p>

                  <p>
                    <strong>Submitted:</strong>{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => openApprovalModal(app._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectApplication(app._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-purple-900 mb-6">
              Approve Membership
            </h2>

            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                <h3 className="text-lg font-bold text-purple-900 mb-3">
                  Membership Approval
                </h3>

                <p className="text-gray-700 leading-7">
                  This applicant will immediately receive an approval email.
                </p>

                <p className="text-gray-700 leading-7 mt-3">
                  The email contains the three available initiation payment
                  packages.
                </p>

                <p className="text-gray-700 leading-7 mt-3">
                  After payment has been completed, you will later schedule the
                  initiation date and send another notification.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="border px-6 py-3 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={approveApplication}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Approve & Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApplications;
