import { useEffect, useState } from "react";
import axios from "axios";

interface Member {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  approved: boolean;
  photo?: string;
}

const OgboniMembers = () => {
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

  if (loading) {
    return <div className="p-8">Loading members...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-purple-900 mb-8">
        Ogboni Members
      </h1>

      {members.filter((m) => m.approved).length === 0 ? (
        <p>No approved members.</p>
      ) : (
        <div className="space-y-6">
          {members
            .filter((m) => m.approved)
            .map((member) => (
              <div key={member._id} className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold">{member.fullName}</h2>

                <p>{member.email}</p>

                <p>{member.phoneNumber}</p>

                <p>{member.username}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default OgboniMembers;
