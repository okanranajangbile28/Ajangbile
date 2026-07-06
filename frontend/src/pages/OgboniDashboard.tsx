import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Member {
  _id?: string;
  username?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  occupation?: string;
  chiefTitle?: string;
  ChiefTitle?: string;
  chieftaincyTitle?: string;
  state?: string;
  lga?: string;
  city?: string;
  address?: string;
  photo?: string;
}

const OgboniDashboard = () => {
  const navigate = useNavigate();

  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const storedMember = localStorage.getItem("ogboniMember");

    if (!storedMember) {
      navigate("/ogboni-login");
      return;
    }

    const parsedMember = JSON.parse(storedMember);

    console.log("MEMBER DATA:", parsedMember);

    setMember(parsedMember);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("ogboniMember");
    localStorage.removeItem("ogboniToken");
    navigate("/ogboni-login");
  };

  const memberTitle =
    member?.chiefTitle ||
    member?.ChiefTitle ||
    member?.chieftaincyTitle ||
    "Not Assigned";

  return (
    <div className="min-h-screen bg-purple-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-purple-900 rounded-3xl shadow-xl p-10">
          {/* Header */}

          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img
                src={
                  member?.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    member?.fullName || member?.username || "Member",
                  )}`
                }
                alt={member?.fullName}
                className="w-40 h-40 rounded-full border-4 border-yellow-400 object-cover shadow-lg"
              />

              <div>
                <h1 className="text-4xl font-bold text-yellow-400">
                  Welcome, Chief {member?.fullName || member?.username}
                </h1>

                <p className="mt-3 text-gray-300 text-lg leading-relaxed">
                  Confederation of Ogboni Aborigine Fraternity,
                  <br />
                  Iledi Ajangbile.
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold"
            >
              Logout
            </button>
          </div>

          {/* Summary Cards */}

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-purple-800 rounded-2xl p-6">
              <h2 className="text-yellow-400 text-2xl font-bold mb-4">
                Membership Status
              </h2>

              <p className="text-xl">Active Member</p>
            </div>

            <div className="bg-purple-800 rounded-2xl p-6">
              <h2 className="text-yellow-400 text-2xl font-bold mb-4">Email</h2>

              <p>{member?.email}</p>
            </div>

            <div className="bg-purple-800 rounded-2xl p-6">
              <h2 className="text-yellow-400 text-2xl font-bold mb-4">
                Phone Number
              </h2>

              <p>{member?.phoneNumber}</p>
            </div>

            <div className="bg-purple-800 rounded-2xl p-6">
              <h2 className="text-yellow-400 text-2xl font-bold mb-4">
                Chieftaincy Title
              </h2>

              <p className="text-xl font-semibold text-yellow-300">
                {memberTitle}
              </p>
            </div>
          </div>

          {/* Member Profile */}

          <div className="mt-10 bg-purple-800 rounded-2xl p-8">
            <h2 className="text-3xl text-yellow-400 font-bold mb-6">
              Member Profile
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <p>
                <strong>Full Name:</strong> {member?.fullName}
              </p>

              <p>
                <strong>Username:</strong> {member?.username}
              </p>

              <p>
                <strong>Email:</strong> {member?.email}
              </p>

              <p>
                <strong>Phone Number:</strong> {member?.phoneNumber}
              </p>

              <p>
                <strong>Gender:</strong> {member?.gender}
              </p>

              <p>
                <strong>Occupation:</strong> {member?.occupation}
              </p>

              <p>
                <strong>State:</strong> {member?.state}
              </p>

              <p>
                <strong>L.G.A:</strong> {member?.lga}
              </p>

              <p>
                <strong>City:</strong> {member?.city}
              </p>

              <p>
                <strong>Chief Title:</strong> {memberTitle}
              </p>

              <p className="md:col-span-2">
                <strong>Address:</strong> {member?.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OgboniDashboard;
