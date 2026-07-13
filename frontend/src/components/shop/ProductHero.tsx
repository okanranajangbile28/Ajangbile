const ProductHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-purple-950 via-purple-900 to-purple-800">
      {/* Decorative Background */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-yellow-400/20 blur-3xl"></div>

      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-purple-600/20 blur-3xl"></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-28 text-center text-white">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-400 text-yellow-300 px-5 py-2 rounded-full font-semibold mb-8">
          ✦ Sacred Heritage Collection
        </div>

        {/* Small Heading */}
        <p className="uppercase tracking-[8px] text-yellow-400 font-semibold mb-5">
          AJANGBILE HERITAGE
        </p>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
          Spiritual <span className="text-yellow-400">Products</span>
        </h1>

        {/* Description */}
        <p className="mt-8 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-8">
          Discover authentic spiritual items, sacred objects, traditional
          artifacts, herbs, books, ceremonial materials and exclusive heritage
          collections carefully selected to preserve our ancient traditions,
          wisdom and culture.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-purple-950 font-bold px-8 py-4 rounded-full transition duration-300 shadow-lg">
            Browse Collection
          </button>

          <button className="border-2 border-white hover:bg-white hover:text-purple-950 text-white font-bold px-8 py-4 rounded-full transition duration-300">
            Learn More
          </button>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-16 fill-white"
        >
          <path d="M0,0V46.29c47.29,22,103.77,29,158,17C230.48,48,284,4,339,0c54.55-4,108.72,32,163,54s108.58,30,163,12c54.4-18,108.8-62,163-70s108.66,20,163,39c54.33,19,108.67,29,163,15V0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default ProductHero;
