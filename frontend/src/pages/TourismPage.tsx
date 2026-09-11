import { useEffect } from "react";
import { Link } from "react-router-dom";

const destinations = [
  {
    title: "Olumo Rock",
    location: "Abeokuta, Ogun State",
    description:
      "Explore one of Abeokuta's most iconic natural landmarks and discover the history, legends and cultural significance surrounding Olumo Rock.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/1/18/Olumo_rock_tourist.jpg",
  },
  {
    title: "Opa Oranmiyan",
    location: "Ile-Ife, Osun State",
    description:
      "Visit the historic Opa Oranmiyan, an important monument associated with Yoruba history, heritage and the ancient city of Ile-Ife.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/8d/Opa_Oranmiyan_-_a_monumental_staff_01.jpg",
  },
  {
    title: "Adire Mall",
    location: "Abeokuta, Ogun State",
    description:
      "Experience the beauty of Adire, the celebrated Yoruba indigo textile tradition, and discover the craftsmanship, creativity and heritage behind these distinctive fabrics.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/Adir%C3%A9_mall.jpg",
  },
];

const TourismPage = () => {
  useEffect(() => {
    document.title = "Tourism | Okanran Ajangbile";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-100 text-gray-900">
      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="bg-gradient-to-r from-purple-900 via-purple-700 to-yellow-700 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-yellow-300 font-semibold tracking-[0.25em] uppercase text-sm mb-5">
            Ajangbile Heritage Tourism
          </p>

          <h1 className="text-5xl md:text-7xl font-bold text-yellow-300 mb-8">
            Discover Yoruba Heritage visiting remarkable places
          </h1>

          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-10">
            Journey through remarkable places, historic landmarks and living
            traditions that tell the story of Yoruba civilisation, culture and
            heritage.
          </p>

          <div className="mt-12">
            <a
              href="#destinations"
              className="inline-block bg-yellow-400 text-black px-10 py-4 rounded-full font-bold hover:bg-yellow-300 transition duration-300 shadow-lg"
            >
              Explore Destinations
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRODUCTION
      ===================================================== */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-yellow-700 uppercase">
            Explore • Experience • Discover
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-purple-900 mt-3 mb-8">
            Explore Yoruba Heritage
          </h2>

          <p className="text-lg md:text-xl leading-9 text-gray-700 max-w-4xl mx-auto">
            Discover remarkable places across{" "}
            <span className="text-purple-900 font-bold">Africa</span> where
            Yoruba history, culture, craftsmanship and tradition come alive.
          </p>
        </div>
      </section>

      {/* =====================================================
          DESTINATIONS
      ===================================================== */}
      <section id="destinations" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-center font-bold text-purple-900 mb-6">
            Featured Destinations
          </h2>

          <p className="text-center text-gray-700 text-lg leading-8 max-w-3xl mx-auto mb-14">
            Visit some of the remarkable cultural and historical destinations
            that showcase the richness of Yoruba heritage.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <div
                key={destination.title}
                className="bg-purple-50 border border-purple-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
              >
                {/* Destination Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Destination Content */}
                <div className="p-7">
                  <p className="text-purple-700 font-semibold text-sm mb-2">
                    {destination.location}
                  </p>

                  <h3 className="text-2xl font-bold text-purple-900 mb-4">
                    {destination.title}
                  </h3>

                  <p className="text-gray-700 leading-8">
                    {destination.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-purple-900 font-semibold">
                      Cultural Destination
                    </span>

                    <span className="text-2xl font-bold text-yellow-600">
                      →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          HERITAGE EXPERIENCE
      ===================================================== */}
      <section className="py-20 px-6 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-center font-bold text-purple-900 mb-8">
            Experience Living Heritage
          </h2>

          <p className="text-center text-gray-700 text-lg leading-9 max-w-4xl mx-auto mb-14">
            Tourism is more than visiting a destination. It is an opportunity to
            connect with history, communities, traditions, art, craftsmanship
            and the stories that have been passed from one generation to
            another.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-yellow-500">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">
                History
              </h3>

              <p className="text-gray-700 leading-8">
                Discover places connected to the rich history and development of
                Yoruba civilisation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-yellow-500">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">
                Culture
              </h3>

              <p className="text-gray-700 leading-8">
                Experience traditions, festivals, storytelling and cultural
                expressions that remain alive today.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-yellow-500">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">
                Craftsmanship
              </h3>

              <p className="text-gray-700 leading-8">
                Discover the creativity behind traditional Yoruba arts,
                textiles, crafts and design.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border-t-4 border-yellow-500">
              <h3 className="text-2xl font-bold text-purple-900 mb-4">
                Community
              </h3>

              <p className="text-gray-700 leading-8">
                Connect with the people and communities preserving Yoruba
                heritage for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CULTURAL JOURNEY
      ===================================================== */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-14 border border-purple-100">
            <div className="text-center max-w-4xl mx-auto">
              <p className="text-yellow-700 font-bold tracking-[0.2em] uppercase text-sm">
                A Journey Through Heritage
              </p>

              <h2 className="text-4xl md:text-5xl font-bold text-purple-900 mt-4 mb-7">
                Discover. Experience. Preserve.
              </h2>

              <p className="text-lg text-gray-700 leading-9">
                From the ancient landscapes of Ile-Ife to the historic landmarks
                of Abeokuta, Yoruba heritage continues to tell stories of
                resilience, creativity, spirituality and identity.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-900">Discover</h3>

                <p className="text-gray-600 mt-3 leading-7">
                  Explore historic landmarks and important cultural
                  destinations.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-900">
                  Experience
                </h3>

                <p className="text-gray-600 mt-3 leading-7">
                  Connect with traditions, communities, art and craftsmanship.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-900">Preserve</h3>

                <p className="text-gray-600 mt-3 leading-7">
                  Help keep cultural knowledge and heritage alive for future
                  generations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUOTE SECTION
      ===================================================== */}
      <section className="py-20 px-6 bg-purple-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-3xl md:text-4xl italic text-yellow-300 leading-10">
            "Our heritage is the story of who we are and the foundation of where
            we are going."
          </p>

          <div className="w-20 h-1 bg-yellow-400 mx-auto mt-8" />

          <p className="mt-8 text-lg text-purple-100">
            Preserving culture. Celebrating history. Inspiring discovery.
          </p>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-800 to-yellow-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Begin Your Heritage Journey
          </h2>

          <p className="text-lg md:text-xl leading-8 mb-10">
            Discover the places, stories and traditions that make Yoruba
            heritage an important part of Nigeria's cultural identity.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#destinations"
              className="bg-white text-purple-900 px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition duration-300"
            >
              Explore Destinations
            </a>

            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-purple-900 transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TourismPage;
