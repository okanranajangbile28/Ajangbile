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
    | "Pending"
    | "Interview Scheduled"
    | "Initiation Scheduled"
    | "Accepted"
    | "Rejected"
    | "Completed";

  adminNotes?: string;

  createdAt: string;
}

const statuses = [
  "Pending",
  "Interview Scheduled",
  "Initiation Scheduled",
  "Accepted",
  "Rejected",
  "Completed",
];

const MembershipApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Application | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications`,
      );

      const data = await response.json();

      if (data.success) {
        setApplications(data.applications);
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

  if (loading) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading membership applications...
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-950">
          Membership Applications
        </h1>

        <p className="text-gray-600 mt-2">
          Review and manage new initiation membership requests.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-purple-950 text-white">
            <tr>
              <th className="p-4 text-left">Applicant</th>

              <th className="p-4 text-left">Contact</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((application) => (
              <tr key={application._id} className="border-b">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={application.photo}
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-bold">{application.fullName}</p>

                      <p className="text-sm text-gray-500">
                        {application.occupation}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-4">
                  <p>{application.email}</p>

                  <p>{application.phone}</p>
                </td>

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

                <td className="p-4 space-x-3">
                  <button
                    onClick={() => setSelected(application)}
                    className="bg-yellow-500 px-4 py-2 rounded-lg font-semibold"
                  >
                    View
                  </button>

                  <button
                    onClick={() => deleteApplication(application._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6">
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

            <div className="grid md:grid-cols-2 gap-6">
              <img src={selected.photo} className="rounded-xl w-full" />

              <img
                src={selected.signature}
                className="rounded-xl w-full border"
              />
            </div>

            <div className="mt-8 space-y-3">
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
                <b>Address:</b> {selected.address}
              </p>

              <p>
                <b>Reason for joining:</b>
              </p>

              <p className="bg-gray-100 p-4 rounded-xl">{selected.reason}</p>

              <p>
                <b>Declaration:</b>{" "}
                {selected.declarationAccepted ? "Accepted" : "Not accepted"}
              </p>

              <p>
                <b>Confidentiality Agreement:</b>{" "}
                {selected.ndaAccepted ? "Accepted" : "Not accepted"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipApplications;
