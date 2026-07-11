import { Link } from "react-router-dom";
import { Landmark, UserPlus } from "lucide-react";

import ogboniLogo from "../assets/Ogboni-logo.png";
import eldersImage from "../assets/Ogboni-elders.jpg";

const values = [
  {
    title: "Wisdom",
    description:
      "We value knowledge, deep understanding and wise judgement in all matters.",
  },
  {
    title: "Integrity",
    description:
      "We uphold truth, honesty and moral uprightness in all our dealings.",
  },
  {
    title: "Heritage",
    description:
      "We preserve and promote Yoruba culture, traditions and sacred teachings.",
  },
  {
    title: "Loyalty",
    description:
      "We remain faithful to our fraternity, our people and our shared values.",
  },
  {
    title: "Growth",
    description:
      "We encourage continuous personal, spiritual and communal development.",
  },
  {
    title: "Unity",
    description:
      "We foster peace, brotherhood and harmony among members and society.",
  },
];

function OgboniPage() {
  return (
    <div className="min-h-screen bg-purple-950 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <img
            src={ogboniLogo}
            alt="Ogboni Logo"
            className="w-40 h-40 object-contain"
          />

          <div>
            <h1 className="text-3xl md:text-6xl font-bold leading-tight text-yellow-400">
              Confederation of Ogboni Aborigine Fraternity of Nigeria, Ogun
              State Chapter
            </h1>

            <p className="mt-6 text-xl italic text-yellow-200">
              Preserving Yoruba culture, wisdom, leadership, truth and sacred
              traditions for future generations.
            </p>
          </div>
        </div>

        {/* About */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold text-yellow-400 mb-6">
              About Ogboni
            </h2>

            <p className="text-lg leading-9 text-gray-200">
              The Ogboni institution is one of the oldest and most revered
              traditional institutions among the Yoruba people. It represents
              wisdom, justice, leadership and spiritual guidance.
              <br />
              <br />
              For centuries, Ogboni has played a vital role in preserving Yoruba
              customs, promoting peace, resolving disputes and safeguarding
              sacred traditions for future generations.
              <br />
              <br />
              The fraternity remains committed to truth, honour, community
              development and the advancement of Yoruba heritage throughout
              Nigeria and beyond.
            </p>
          </div>

          <div>
            <img
              src={eldersImage}
              alt="Ogboni Elders"
              className="rounded-3xl shadow-2xl w-full"
            />
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-24">
          <h2 className="text-4xl text-center font-bold text-yellow-400 mb-12">
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-purple-900 border border-yellow-500 rounded-2xl p-8 text-center shadow-lg"
              >
                <h3 className="text-2xl font-bold text-yellow-300 mb-4">
                  {value.title}
                </h3>

                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Portal Options */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-yellow-400 mb-5">
            Begin Your Journey
          </h2>

          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Whether you are an existing member of Iledi Ajangbile or wish to
            begin your journey into the fraternity, choose one of the options
            below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Iledi */}
          <Link
            to="/iledi-ajangbile"
            className="group bg-purple-900 border border-yellow-500 rounded-3xl p-10 text-center shadow-xl hover:scale-105 hover:bg-purple-800 transition duration-300"
          >
            <div className="flex justify-center mb-6">
              <Landmark
                size={70}
                className="text-yellow-400 group-hover:scale-110 transition"
              />
            </div>

            <h3 className="text-3xl font-bold text-yellow-300 mb-5">
              Iledi Ajangbile
            </h3>

            <p className="text-gray-300 leading-8 mb-8">
              Access the official members' portal to log in, create your account
              after approval, and stay connected with fraternity activities.
            </p>

            <span className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-full font-bold">
              Enter Iledi →
            </span>
          </Link>

          {/* Become Member */}
          <Link
            to="/become-member"
            className="group bg-purple-900 border border-yellow-500 rounded-3xl p-10 text-center shadow-xl hover:scale-105 hover:bg-purple-800 transition duration-300"
          >
            <div className="flex justify-center mb-6">
              <UserPlus
                size={70}
                className="text-yellow-400 group-hover:scale-110 transition"
              />
            </div>

            <h3 className="text-3xl font-bold text-yellow-300 mb-5">
              Become a Member
            </h3>

            <p className="text-gray-300 leading-8 mb-8">
              Submit your membership application and begin your journey toward
              becoming part of the Confederation of Ogboni Aborigine Fraternity.
            </p>

            <span className="inline-block border-2 border-yellow-500 text-yellow-300 px-8 py-3 rounded-full font-bold group-hover:bg-yellow-500 group-hover:text-black transition">
              Apply Now →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OgboniPage;
