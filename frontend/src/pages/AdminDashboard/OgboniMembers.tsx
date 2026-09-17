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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const deleteMember = async (member: Member) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${member.fullName}?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(member._id);

      await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/members/${member._id}`,
      );

      setMembers((currentMembers) =>
        currentMembers.filter((item) => item._id !== member._id),
      );
    } catch (err) {
      console.log(err);
      alert("Unable to delete this member. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const approvedMembers = members.filter((member) => member.approved);

  if (loading) {
    return <div className="p-8">Loading members...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-purple-900 mb-8">
        Ogboni Members
      </h1>

      {approvedMembers.length === 0 ? (
        <p>No approved members.</p>
      ) : (
        <div className="space-y-6">
          {approvedMembers.map((member) => (
            <div key={member._id} className="bg-white rounded-xl shadow p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <h2 className="text-xl font-bold">{member.fullName}</h2>

                  <p>{member.email}</p>

                  <p>{member.phoneNumber}</p>

                  <p>{member.username}</p>
                </div>

                <button
                  type="button"
                  onClick={() => deleteMember(member)}
                  disabled={deletingId === member._id}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-semibold transition"
                >
                  {deletingId === member._id ? "Deleting..." : "Delete Member"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OgboniMembers;
