import { Link } from "react-router-dom";
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
        {/* Header Section */}
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

        {/* About Section */}
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
        <div className="mb-20">
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

        {/* Members Portal */}
        <div className="bg-purple-900 border border-yellow-500 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-yellow-400 mb-6">
            Members Portal
          </h2>

          <p className="text-lg text-gray-300 mb-8">
            Access exclusive resources, updates and fraternity announcements
            through the secure members portal.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link
              to="/ogboni-login"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-10 py-4 rounded-full font-bold transition duration-300"
            >
              Login
            </Link>

            <Link
              to="/ogboni/signup"
              className="border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black px-10 py-4 rounded-full font-bold transition duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OgboniPage;
