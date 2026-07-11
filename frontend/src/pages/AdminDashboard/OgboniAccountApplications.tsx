import { useEffect, useState } from "react";
import axios from "axios";

interface Member {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  occupation: string;
  state: string;
  approved: boolean;
  photo?: string;
}

const OgboniAccountApplications = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/members`,
      );

      setMembers(res.data.members || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const approve = async (id: string) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/approve/${id}`,
      );

      fetchApplications();
    } catch (err) {
      console.log(err);
    }
  };

  const reject = async (id: string) => {
    if (!window.confirm("Reject this application?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/reject/${id}`,
      );

      fetchApplications();
    } catch (err) {
      console.log(err);
    }
  };

  const pending = members.filter((m) => !m.approved);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-purple-900 mb-8">
        Ogboni Account Applications
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : pending.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8">
          <p className="text-gray-600">
            No account applications awaiting approval.
          </p>
        </div>
      ) : (
        pending.map((member) => (
          <div
            key={member._id}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row gap-6"
          >
            <div>
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.fullName}
                  className="w-36 h-36 rounded-xl object-cover border"
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

              <div className="grid md:grid-cols-2 gap-2 mt-4">
                <p>
                  <strong>Username:</strong> {member.username}
                </p>

                <p>
                  <strong>Email:</strong> {member.email}
                </p>

                <p>
                  <strong>Phone:</strong> {member.phoneNumber}
                </p>

                <p>
                  <strong>Occupation:</strong> {member.occupation}
                </p>

                <p>
                  <strong>State:</strong> {member.state}
                </p>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => approve(member._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Approve
                </button>

                <button
                  onClick={() => reject(member._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OgboniAccountApplications;
