import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import FormInput from "../components/global_components/FormInput";
import FormTextArea from "../components/global_components/FormTextArea";
import {
  MdOutlineLocationOn,
  MdOutlineLocalPhone,
  MdOutlineEmail,
} from "react-icons/md";
import { Link } from "react-router-dom";

interface ContactResponse {
  message: string;
}

const ContactPage = () => {
  useEffect(() => {
    document.title = "Ajangbile Heritage | Contact";
  }, []);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post<ContactResponse>(
        `${import.meta.env.VITE_SERVER_URL}/api/contact`,
        formData,
      );

      setSuccess(res.data.message);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
            "Unable to send your message. Please try again.",
        );
      } else {
        setError("Unable to send your message. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col pt-[20px] pb-[80px] bg-white">
      <div className="flex flex-col lg:items-center pt-[24px] pb-[10px] px-[10px] gap-[24px] bg-white">
        <div className="grid lg:grid-cols-2 px-[24px] lg:px-[52px] py-[24px] justify-between gap-[100px]">
          {/* Left Side */}
          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-[20px]">
              <div className="font-Manrope font-semibold text-[24px] md:text-[36px] leading-[127%] text-[#011334]">
                Talk With Us
              </div>

              <div className="font-Manrope font-normal text-[16px] leading-[26px] text-[#011334]">
                Questions, comments, or suggestions? Simply fill in the form and
                we'll be in touch shortly.
              </div>
            </div>

            <ul className="flex flex-col gap-[15px]">
              <li className="flex gap-[10px] items-center">
                <span className="text-[#4b0082]">
                  <MdOutlineLocationOn size={30} />
                </span>

                <span className="font-Manrope font-bold text-[18px] leading-[26px] text-[#011334]">
                  No. 1 Osara Street, Ode-Eran, Obantoko, Abeokuta, Ogun State.
                </span>
              </li>

              <li className="flex gap-[10px] items-center">
                <span className="text-[#4b0082]">
                  <MdOutlineLocalPhone size={30} />
                </span>

                <Link
                  to="tel:+2349023323697"
                  className="font-Manrope font-bold text-[18px] leading-[26px] text-[#011334]"
                >
                  +2349023323697
                </Link>

                <Link
                  to="tel:+22967321203"
                  className="font-Manrope font-bold text-[18px] leading-[26px] text-[#011334]"
                >
                  +22967321203
                </Link>
              </li>

              <li className="flex gap-[10px] items-center">
                <span className="text-[#4b0082]">
                  <MdOutlineEmail size={30} />
                </span>

                <span className="font-Manrope font-bold text-[18px] leading-[26px] text-[#011334]">
                  admin@ajangbileheritage.com
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <form onSubmit={submitForm} className="flex flex-col gap-[18px]">
            <div
              className="flex flex-col justify-center items-center py-[48px] px-[24px] sm:p-[50px] gap-[10px] bg-white border border-[#bdbdbd] rounded-[10px]"
              style={{ boxShadow: "0px 0px 30px rgba(0,0,0,0.1)" }}
            >
              <div className="flex flex-col gap-[20px] w-full">
                {success && (
                  <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg p-4">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4">
                    {error}
                  </div>
                )}

                <div className="grid min-[550px]:grid-cols-2 gap-[21px]">
                  <FormInput
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    customStyle="w-full"
                  />

                  <FormInput
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    customStyle="w-full"
                  />
                </div>

                <FormInput
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />

                <FormInput
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <FormInput
                  name="subject"
                  placeholder="Subject (Optional)"
                  value={formData.subject}
                  onChange={handleChange}
                />

                <FormTextArea
                  name="message"
                  placeholder="Your Message..."
                  value={formData.message}
                  onChange={handleChange}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="py-[12px] px-[32px] bg-[#4b0082] rounded-[8px] font-inter font-semibold text-[14px] leading-[14px] text-white flex justify-center disabled:opacity-50 hover:bg-purple-900 transition"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
