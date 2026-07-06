import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Member {
  _id?: string;
  fullName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  occupation?: string;
  state?: string;
  lga?: string;
  city?: string;
  address?: string;
  photo?: string;
}

const OgboniEditProfile = () => {
  const navigate = useNavigate();

  const [member, setMember] = useState<Member>({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    occupation: "",
    state: "",
    lga: "",
    city: "",
    address: "",
    photo: "",
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ogboniMember");

    if (!stored) {
      navigate("/ogboni-login");
      return;
    }

    setMember(JSON.parse(stored));
  }, [navigate]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setMember({
      ...member,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setPhoto(e.target.files[0]);
    }
  };

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();

    if (!member._id) return;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("fullName", member.fullName || "");
      formData.append("phoneNumber", member.phoneNumber || "");
      formData.append("occupation", member.occupation || "");
      formData.append("state", member.state || "");
      formData.append("lga", member.lga || "");
      formData.append("city", member.city || "");
      formData.append("address", member.address || "");

      if (photo) {
        formData.append("images", photo);
      }

      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/api/ogboni/update-profile/${member._id}`,
        formData,
      );

      localStorage.setItem("ogboniMember", JSON.stringify(res.data.user));

      alert("Profile updated successfully.");

      navigate("/ogboni-dashboard");
    } catch (err) {
      console.log(err);
      alert("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-950 flex justify-center p-6">
      <form
        onSubmit={saveProfile}
        className="bg-purple-900 w-full max-w-3xl rounded-3xl p-8 space-y-5"
      >
        <h1 className="text-4xl font-bold text-yellow-400">Edit Profile</h1>

        <input
          name="fullName"
          value={member.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-3 rounded-lg"
        />

        <input
          name="phoneNumber"
          value={member.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full p-3 rounded-lg"
        />

        <input
          name="occupation"
          value={member.occupation}
          onChange={handleChange}
          placeholder="Occupation"
          className="w-full p-3 rounded-lg"
        />

        <input
          name="state"
          value={member.state}
          onChange={handleChange}
          placeholder="State"
          className="w-full p-3 rounded-lg"
        />

        <input
          name="lga"
          value={member.lga}
          onChange={handleChange}
          placeholder="LGA"
          className="w-full p-3 rounded-lg"
        />

        <input
          name="city"
          value={member.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full p-3 rounded-lg"
        />

        <textarea
          name="address"
          value={member.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-3 rounded-lg"
        />

        <input
          type="file"
          onChange={handlePhoto}
          accept="image/*"
          className="text-white"
        />

        <button
          disabled={saving}
          className="bg-yellow-500 hover:bg-yellow-600 w-full py-4 rounded-xl text-black font-bold"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default OgboniEditProfile;
