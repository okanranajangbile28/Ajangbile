import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    document.title = "Okanran Ajangbile | About";
  }, []);

  return (
    <div className="md:pl-[84px] px-[16px] sm:px-[32px] md:pr-[62px] pt-[20px] pb-[80px] flex flex-col gap-[17px]">
      <div className="font-Open text-[20px] leading-[32px] self-stretch text-[#c4c4c4]">
        About Us
      </div>

      <div className="flex flex-col self-stretch gap-[32px]">
        <div className="flex flex-col gap-[16px]">
          <div className="capitalize font-Manrope text-[24px] sm:text-[32px] leading-[125%] self-stretch text-[#4b0082]">
            Get to Know Okanran Ajangbile
          </div>

          <div className="font-Open font-light text-[14px] sm:text-[18px] leading-[178%] text-[rgba(0,0,0,0.7)]">
            Okanran Ajangbile is dedicated to preserving, promoting, and
            teaching the authentic traditions of Ifa, Ogboni, and African
            spirituality. Our mission is to connect people with the timeless
            wisdom of our ancestors while providing genuine guidance rooted in
            Yoruba culture, ethics, and spiritual heritage.
            <br />
            <br />
            Through education, consultation, spiritual counselling, and
            carefully prepared traditional materials, we strive to make the
            knowledge of African spirituality accessible to those seeking
            understanding, healing, and personal growth.
          </div>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div className="capitalize font-Manrope text-[24px] sm:text-[32px] leading-[125%] self-stretch text-[#4b0082]">
            Who We Are
          </div>

          <div className="font-Open font-light text-[14px] sm:text-[18px] leading-[178%] text-[rgba(0,0,0,0.7)]">
            We are practitioners, researchers, and custodians of indigenous
            African knowledge with years of experience in Ifa divination, Ogboni
            traditions, and Yoruba cultural practices. Our commitment is to
            uphold authenticity, integrity, and respect for these sacred
            traditions.
            <br />
            <br />
            Whether you are seeking spiritual consultation, traditional
            education, cultural knowledge, or authentic African spiritual
            materials, Okanran Ajangbile provides a trusted platform where
            tradition meets modern accessibility. We welcome everyone who
            desires to learn, grow, and reconnect with the rich heritage of
            African spirituality.
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
