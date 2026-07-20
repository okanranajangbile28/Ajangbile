import { Link } from "react-router-dom";

const services = [
  {
    title: "Ifa Consultation",
    description:
      "Receive spiritual guidance and divine insights through authentic Ifa consultation.",
  },
  {
    title: "Dream Interpretation",
    description:
      "Understand the spiritual meaning behind your dreams and visions.",
  },
  {
    title: "Spiritual Cleansing",
    description:
      "Remove negative energies and restore spiritual balance and protection.",
  },
  {
    title: "Ancestral Guidance",
    description:
      "Seek wisdom and direction from ancestral traditions and sacred teachings.",
  },
  {
    title: "Marriage & Family Guidance",
    description:
      "Receive spiritual counsel concerning marriage, relationships and family matters.",
  },
  {
    title: "Business & Career Consultation",
    description:
      "Gain divine guidance concerning business decisions, career growth and prosperity.",
  },
];

const ConsultationPage = () => {
  return (
    <div className="min-h-screen bg-purple-950 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-yellow-400 mb-8">
            Spiritual Consultation
          </h1>

          <p className="max-w-4xl mx-auto text-xl text-gray-300 leading-9">
            Seek wisdom, clarity, guidance and spiritual solutions through
            authentic Yoruba traditional consultation and sacred teachings.
          </p>
        </div>

        {/* Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-purple-900 border border-yellow-500 rounded-3xl p-8 shadow-xl"
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                {service.title}
              </h2>

              <p className="text-gray-300 leading-8">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Booking Section */}
        <div className="bg-purple-900 border border-yellow-500 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-yellow-400 mb-6">
            Book A Consultation
          </h2>

          <p className="text-lg text-gray-300 mb-8">
            Ready to receive spiritual guidance? Contact us today to schedule a
            private consultation session.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            <a
              href="https://wa.me/2349023323697"
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 hover:bg-green-700 px-10 py-4 rounded-full font-bold transition duration-300"
            >
              WhatsApp Us
            </a>

            <Link
              to="/contact"
              className="border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black px-10 py-4 rounded-full font-bold transition duration-300"
            >
              Contact Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;
