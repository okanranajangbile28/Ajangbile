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
  status: string;

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

  const saveInitiationDetails = async () => {
    if (!selectedMember) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/save-initiation/${selectedMember._id}`,
        formData,
      );

      alert("Initiation details saved successfully.");

      setShowScheduleModal(false);

      fetchPaidMembers();
    } catch (err) {
      console.error(err);

      alert("Unable to save initiation details.");
    }
  };

  const sendInitiationEmail = async (id: string) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/membership-applications/send-initiation-email/${id}`,
      );

      alert("Initiation email sent successfully.");

      fetchPaidMembers();
    } catch (err) {
      console.error(err);

      alert("Unable to send initiation email.");
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
                    <strong>Occupation:</strong> {member.occupation}
                  </p>

                  <p>
                    <strong>State:</strong> {member.state}
                  </p>

                  <p>
                    <strong>City:</strong> {member.city}
                  </p>

                  <p className="mt-2">
                    <strong>Status:</strong>{" "}
                    <span className="text-green-700 font-bold">
                      {member.status}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-4 mt-6">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                      View Full Application
                    </button>

                    <button
                      onClick={() => openScheduleModal(member)}
                      className="bg-purple-900 hover:bg-purple-800 text-white px-6 py-3 rounded-lg"
                    >
                      Schedule Initiation
                    </button>

                    <button
                      onClick={() => sendInitiationEmail(member._id)}
                      className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg"
                    >
                      Send Initiation Email
                    </button>
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
              Schedule Initiation
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
                onClick={() => setShowScheduleModal(false)}
                className="bg-gray-300 px-6 py-3 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={saveInitiationDetails}
                className="bg-purple-900 text-white px-6 py-3 rounded-lg"
              >
                Save Initiation Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaidMembers;
