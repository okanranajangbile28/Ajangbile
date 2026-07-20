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
      navigate("/login", { replace: true });
      return;
    }

    setMember(JSON.parse(storedMember));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("ogboniMember");
    localStorage.removeItem("ogboniToken");

    navigate("/login", { replace: true });
  };

  const memberTitle =
    member?.chiefTitle ||
    member?.ChiefTitle ||
    member?.chieftaincyTitle ||
    "Not Assigned";

  return (
    <div className="min-h-screen bg-purple-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-purple-900 rounded-3xl shadow-xl p-8">
          {/* Header */}

          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex flex-col items-center">
                <img
                  src={
                    member?.photo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      member?.fullName || member?.username || "Member",
                    )}`
                  }
                  alt={member?.fullName}
                  className="w-40 h-40 rounded-full border-4 border-yellow-400 object-cover"
                />

                {/* Mobile Edit Button */}

                <button
                  onClick={() => navigate("/ogboni-edit-profile")}
                  className="md:hidden mt-5 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-xl font-bold w-full"
                >
                  Edit Profile
                </button>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold text-yellow-400">
                  Welcome, Chief {member?.fullName || member?.username}
                </h1>

                <p className="mt-3 text-gray-300 text-lg">
                  Confederation of Ogboni Aborigine Fraternity,
                  <br />
                  Iledi Ajangbile.
                </p>
              </div>
            </div>

            {/* Desktop Logout */}

            <div className="hidden md:flex">
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold h-fit"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Summary */}

          <div className="grid md:grid-cols-4 gap-6 mt-10">
            <div className="bg-purple-800 rounded-2xl p-6">
              <h2 className="text-yellow-400 text-2xl font-bold mb-3">
                Membership Status
              </h2>

              <p>Active Member</p>
            </div>

            <div className="bg-purple-800 rounded-2xl p-6">
              <h2 className="text-yellow-400 text-2xl font-bold mb-3">Email</h2>

              <p>{member?.email}</p>
            </div>

            <div className="bg-purple-800 rounded-2xl p-6">
              <h2 className="text-yellow-400 text-2xl font-bold mb-3">
                Phone Number
              </h2>

              <p>{member?.phoneNumber}</p>
            </div>

            <div className="bg-purple-800 rounded-2xl p-6">
              <h2 className="text-yellow-400 text-2xl font-bold mb-3">
                Chieftaincy Title
              </h2>

              <p>{memberTitle}</p>
            </div>
          </div>

          {/* Profile */}

          <div className="mt-10 bg-purple-800 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl text-yellow-400 font-bold">
                Member Profile
              </h2>

              {/* Desktop Edit */}

              <button
                onClick={() => navigate("/ogboni-edit-profile")}
                className="hidden md:block bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-lg font-bold"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
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

          {/* Mobile Logout */}

          <div className="md:hidden mt-10">
            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OgboniDashboard;
