import { Link } from "react-router-dom";
import ImageWithSkeleton from "../global_components/ImageWithSkeleton";

const Hero = () => {
  return (
    <section
      className="
        relative
        min-h-screen
        grid
        md:grid-cols-2
        items-center
        gap-10
        lg:gap-16
        px-6
        sm:px-10
        md:px-12
        lg:px-20
        xl:px-24
        py-16
        overflow-hidden
      "
    >
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <img
          src="https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731057102/OA/HeroBg.webp"
          alt=""
          className="w-full h-full object-cover blur-[4px]"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 -z-10"></div>

      {/* Left */}
      <div className="flex flex-col justify-center gap-6">
        <h1 className="font-Manrope font-bold text-white leading-tight text-4xl sm:text-5xl lg:text-6xl">
          Discover the intriguing culture of the Yorubas
        </h1>

        <p className="font-open text-white/90 text-base sm:text-lg leading-8 max-w-xl">
          Explore the rich traditions, vibrant artistry and deep spirituality of
          the Yoruba people, a culture steeped in history, wisdom and timeless
          heritage.
        </p>

        <Link
          to="/shop"
          className="inline-flex w-fit items-center justify-center rounded-full border-2 border-white px-8 py-3 font-bold text-white hover:bg-white hover:text-[#4b0082] transition"
        >
          Explore
        </Link>
      </div>

      {/* Right */}
      <div className="hidden md:flex justify-center items-center">
        <ImageWithSkeleton
          src="https://res.cloudinary.com/dlk2a6ppp/image/upload/v1731056794/OA/culturalWoman.webp"
          alt="Yoruba Culture"
          customStyle="object-contain max-h-[650px] w-full"
          customPlaceholder="rounded-full"
        />
      </div>
    </section>
  );
};

export default Hero;
