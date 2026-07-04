import TestimonialsBlock from "./TestimonialsBlock";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";

const Testimonials = () => {
  return (
    <section className="bg-[#4b0082] py-12 lg:py-24 px-6 sm:px-10 lg:px-16 overflow-hidden">
      {/* Heading */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="text-[#c4c4c4] text-lg">Testimonials</p>

          <h2 className="font-Manrope font-bold text-white text-3xl lg:text-5xl leading-tight max-w-3xl mt-3">
            See some of what our happy clients are saying
          </h2>
        </div>

        <div className="hidden md:flex gap-6 text-5xl">
          <button>
            <FaCircleArrowLeft color="white" />
          </button>

          <button>
            <FaCircleArrowRight color="white" />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <TestimonialsBlock
          name="Firstname Lastname"
          position="Position"
          quote="Things started to work for me when I bought some totems."
        />

        <TestimonialsBlock
          name="Firstname Lastname"
          position="Position"
          quote="The fabric I bought stood out so much that everyone kept asking where I got it."
        />

        <TestimonialsBlock
          name="Firstname Lastname"
          position="Position"
          quote="After using the herbal remedy I purchased, I felt much better."
        />

        <TestimonialsBlock
          name="Firstname Lastname"
          position="Position"
          quote="Things started to work for me when I bought some totems."
        />
      </div>
    </section>
  );
};

export default Testimonials;
