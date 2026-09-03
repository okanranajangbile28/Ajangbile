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
          <button type="button">
            <FaCircleArrowLeft color="white" />
          </button>

          <button type="button">
            <FaCircleArrowRight color="white" />
          </button>
        </div>
      </div>

      {/* Testimonials Carousel */}
      <div className="relative w-full overflow-hidden">
        <div className="testimonial-track">
          {/* FIRST SET */}
          <div className="testimonial-group">
            <div className="testimonial-card">
              <TestimonialsBlock
                name="Firstname Lastname"
                position="Position"
                quote="Things started to work for me when I bought some totems."
              />
            </div>

            <div className="testimonial-card">
              <TestimonialsBlock
                name="Firstname Lastname"
                position="Position"
                quote="The fabric I bought stood out so much that everyone kept asking where I got it."
              />
            </div>

            <div className="testimonial-card">
              <TestimonialsBlock
                name="Firstname Lastname"
                position="Position"
                quote="After using the herbal remedy I purchased, I felt much better."
              />
            </div>

            <div className="testimonial-card">
              <TestimonialsBlock
                name="Firstname Lastname"
                position="Position"
                quote="My children love the Ifa book i bought and now they are encouraged to learn more about Ifa."
              />
            </div>
          </div>

          {/* DUPLICATE SET FOR SEAMLESS LOOP */}
          <div
            className="testimonial-group testimonial-group-duplicate"
            aria-hidden="true"
          >
            <div className="testimonial-card">
              <TestimonialsBlock
                name="Firstname Lastname"
                position="Position"
                quote="Things started to work for me when I bought some totems."
              />
            </div>

            <div className="testimonial-card">
              <TestimonialsBlock
                name="Firstname Lastname"
                position="Position"
                quote="The fabric I bought stood out so much that everyone kept asking where I got it."
              />
            </div>

            <div className="testimonial-card">
              <TestimonialsBlock
                name="Firstname Lastname"
                position="Position"
                quote="After using the herbal remedy I purchased, I felt much better."
              />
            </div>

            <div className="testimonial-card">
              <TestimonialsBlock
                name="Firstname Lastname"
                position="Position"
                quote="My children love the Ifa book i bought and now they are encouraged to learn more about Ifa."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Animation */}
      <style>{`
        .testimonial-track {
          display: flex;
          width: max-content;
          animation: testimonialMove 30s linear infinite;
        }

        .testimonial-group {
          display: flex;
          gap: 40px;
          flex-shrink: 0;
        }

        /* Space between the end of one set and the beginning of the next set */
        .testimonial-group-duplicate {
          margin-left: 40px;
        }

        .testimonial-card {
          width: 320px;
          flex-shrink: 0;
        }

        .testimonial-track:hover {
          animation-play-state: paused;
        }

        @keyframes testimonialMove {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0);
          }
        }

        @media (max-width: 640px) {
          .testimonial-card {
            width: 280px;
          }

          .testimonial-group {
            gap: 28px;
          }

          .testimonial-group-duplicate {
            margin-left: 28px;
          }

          .testimonial-track {
            animation-duration: 24s;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
