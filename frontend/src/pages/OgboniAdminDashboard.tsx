import { useEffect, useState } from "react";
import axios from "axios";

interface Member {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  chiefTitle?: string;
  occupation: string;
  approved: boolean;
}

const OgboniAdminDashboard = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/ogboni/members");

      setMembers(res.data.members);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const approveMember = async (id: string) => {
    try {
      await axios.patch(`http://localhost:3000/api/ogboni/approve/${id}`);

      fetchMembers();
      alert("Member approved successfully");
    } catch (error) {
      console.log(error);
      alert("Approval failed");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="min-h-screen bg-purple-950 p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-10">
          Ogboni Admin Dashboard
        </h1>

        {loading ? (
          <h2>Loading members...</h2>
        ) : (
          <div className="grid gap-6">
            {members.map((member) => (
              <div
                key={member._id}
                className="bg-purple-900 p-6 rounded-2xl shadow"
              >
                <h2 className="text-2xl font-bold text-yellow-400">
                  Chief {member.fullName}
                </h2>

                <p>Email: {member.email}</p>
                <p>Phone: {member.phoneNumber}</p>
                <p>Occupation: {member.occupation}</p>

                <p className="mt-2">
                  Status:
                  <span
                    className={`ml-2 font-bold ${
                      member.approved ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {member.approved ? "Approved" : "Pending"}
                  </span>
                </p>

                {!member.approved && (
                  <button
                    onClick={() => approveMember(member._id)}
                    className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl"
                  >
                    Approve Member
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OgboniAdminDashboard;
