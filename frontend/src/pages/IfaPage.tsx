import { Link } from "react-router-dom";

function IfaPage() {
  const services = [
    "Ifa Divination",
    "Spiritual Consultation",
    "Destiny Revelation",
    "Spiritual Cleansing",
    "Marriage & Relationship Guidance",
    "Business & Career Guidance",
    "Naming Ceremonies",
    "Traditional Initiation Guidance",
  ];

  const oduIfa = [
    "Eji Ogbe",
    "Oyeku Meji",
    "Iwori Meji",
    "Odi Meji",
    "Irosun Meji",
    "Owonrin Meji",
    "Obara Meji",
    "Okanran Meji",
    "Ogunda Meji",
    "Osa Meji",
    "Ika Meji",
    "Oturupon Meji",
    "Otura Meji",
    "Irete Meji",
    "Ose Meji",
    "Ofun Meji",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-100 text-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 via-purple-700 to-yellow-700 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-yellow-300 mb-8">
            Sacred Ifa Tradition
          </h1>

          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-10">
            Ifa is the sacred Yoruba system of divine wisdom, spirituality,
            ethics, philosophy, and destiny guidance revealed through Orunmila,
            the witness of creation.
          </p>

          <div className="mt-12">
            <Link
              to="/consultation"
              className="bg-yellow-400 text-black px-10 py-4 rounded-full font-bold hover:bg-yellow-300 transition duration-300"
            >
              Consult Ifa Today
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-purple-900 mb-8">
            About Ifa
          </h2>

          <p className="text-lg leading-10 text-center text-gray-700">
            Ifa is one of the oldest systems of spiritual knowledge in the
            world. Through divine consultation, individuals receive wisdom
            concerning destiny, health, family, relationships, business,
            prosperity, and spiritual growth.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl text-center font-bold text-purple-900 mb-12">
            Sacred Services
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-purple-100 border border-purple-300 rounded-3xl p-8 text-center hover:shadow-2xl transition duration-300"
              >
                <h3 className="text-xl font-bold text-purple-900">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Odu Ifa Section */}
      <section className="py-20 px-6 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl text-center font-bold text-purple-900 mb-8">
            The First Sixteen Principal Odù Ifá
          </h2>

          <p className="text-center text-gray-700 text-lg leading-8 mb-12">
            The sixteen principal Odù Ifá form the foundation of the Ifa
            literary corpus and contain divine wisdom, philosophy, ethics,
            history, and sacred teachings.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {oduIfa.map((odu, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-yellow-500"
              >
                <h3 className="text-xl font-bold text-purple-900">
                  {index + 1}. {odu}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Consult Ifa */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl text-center font-bold text-purple-900 mb-12">
            Why Consult Ifa?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-bold text-yellow-700 mb-4">
                Divine Guidance
              </h3>

              <p className="text-gray-700 leading-8">
                Receive sacred guidance concerning life's important decisions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-bold text-yellow-700 mb-4">
                Spiritual Protection
              </h3>

              <p className="text-gray-700 leading-8">
                Discover spiritual solutions and protective prescriptions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-bold text-yellow-700 mb-4">
                Destiny Alignment
              </h3>

              <p className="text-gray-700 leading-8">
                Understand and align with your divine destiny.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-bold text-yellow-700 mb-4">
                Peace & Clarity
              </h3>

              <p className="text-gray-700 leading-8">
                Gain clarity and peace concerning the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 px-6 bg-purple-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-3xl italic text-yellow-300">
            "Orunmila ni eleri ipin, Akerefinusogbon."
          </p>

          <p className="mt-8 text-xl">
            "Orunmila is the witness of destiny and the embodiment of wisdom."
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-800 to-yellow-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Seek Divine Guidance Today
          </h2>

          <p className="text-lg mb-10">
            Book a confidential consultation and receive sacred wisdom
            concerning your destiny and future.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            <a
              href="https://wa.me/2349049402607"
              target="_blank"
              rel="noreferrer"
              className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-full font-bold transition duration-300"
            >
              Consult via WhatsApp
            </a>

            <Link
              to="/consultation"
              className="bg-white text-purple-900 px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition duration-300"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default IfaPage;
