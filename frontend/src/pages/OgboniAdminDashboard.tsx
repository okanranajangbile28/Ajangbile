import { useEffect, useState } from "react";
import axios from "axios";

interface Member {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  occupation: string;
  approved: boolean;
}

const OgboniAdminDashboard = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
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
    fetchMembers();
  }, []);

  const approveMember = async (id: string) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/approve/${id}`,
      );

      fetchMembers();
    } catch (err) {
      console.log(err);
    }
  };

  const pending = members.filter((m) => !m.approved);
  const approved = members.filter((m) => m.approved);

  return (
    <div className="min-h-screen bg-purple-950 text-white p-8">
      <h1 className="text-4xl font-bold text-yellow-400 mb-10">
        Ogboni Admin Dashboard
      </h1>

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-purple-900 rounded-xl p-6">
              <h2 className="text-xl">Total Members</h2>

              <p className="text-4xl font-bold text-yellow-400">
                {members.length}
              </p>
            </div>

            <div className="bg-purple-900 rounded-xl p-6">
              <h2 className="text-xl">Pending Approval</h2>

              <p className="text-4xl font-bold text-red-400">
                {pending.length}
              </p>
            </div>

            <div className="bg-purple-900 rounded-xl p-6">
              <h2 className="text-xl">Approved Members</h2>

              <p className="text-4xl font-bold text-green-400">
                {approved.length}
              </p>
            </div>
          </div>

          {/* Pending Applications */}
          <div className="bg-white rounded-xl p-6 text-black">
            <h2 className="text-2xl font-bold mb-6">Pending Applications</h2>

            {pending.length === 0 ? (
              <p>No pending applications.</p>
            ) : (
              pending.map((member) => (
                <div key={member._id} className="border rounded-xl p-5 mb-5">
                  <h3 className="text-xl font-bold">{member.fullName}</h3>

                  <p>{member.email}</p>

                  <p>{member.phoneNumber}</p>

                  <p>{member.occupation}</p>

                  <button
                    onClick={() => approveMember(member._id)}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                  >
                    Approve Member
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OgboniAdminDashboard;
