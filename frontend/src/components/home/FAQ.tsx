import { useState } from "react";
import { ChevronDown } from "lucide-react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Ajangbile Heritage?",
      answer:
        "Ajangbile Heritage is a platform dedicated to preserving and promoting Yoruba heritage, traditional wisdom, culture, spirituality, and community values.",
    },
    {
      question: "What is Ogboni?",
      answer:
        "Ogboni is a traditional Yoruba institution with a long history and an important role in Yoruba society, particularly in matters concerning community welfare, leadership, morality, justice, and social responsibility. Within the Ogboni tradition, it is regarded as a foundational institution that has helped uphold Yoruba values, community order, heritage, and social responsibility.",
    },
    {
      question: "What are the types of Ogboni?",
      answer:
        "Majorly there are two types, the political and the spiritual. The political includes all the chieftains in palaces across the Yoruba land, they have specific names in places like Oyo(Oyomesi), Egba(Akala), Ijebu(Osugbo). The spiritual part is divided into 5 basic foundation (ogboni, ogbo oro, ogbo sika, ogbo mole and awo lanleke. From ogboni stemed so many other awos, parts are, Confedration of Ogboni Aborigene Fraternity, Fellowship of Ogboni Worldwide, Ogboni Alaje, Ogboni RoF, etc. ",
    },
    {
      question: "What are the differences between the various types of Ogboni?",
      answer:
        "Before the white people came, ogboni was never a single body but they all have a single origin (iponri awo ko pe meji). After the arrival of the white people, the campaign of calumny began against the Ogboni which led to decimation of their status and powers. In order to survive the new system, they had to conform which is what gave rise to Ogboni Aborigine. They had to register and conform to the new laws of the colonialists while trying retain their rituals, rites of passage and all ancient practices related to the ogboni. the name aboriginal was adopted as the first registerd name for the Ogboni Faternity worldwide. Many argued that the aboriginal name was imported and not traditional but it was a necessary step towards the evolution at the time, as aboriginal simply translates to indigenous, but as time went on, greed, insubordination, abuse of power, political pressure, influx of external influences unfortunately led to the break up of aborigine. Ogboni saala and other sister fraternity emerged from Ogboni Aborigine, each of them representing and marketing their own values home and abroad. This event further reduce the credibility and the advancement of the ogboni fraternity till this day as there is no strong leadership or enforcemnet of law and order within the fraternity.",
    },
    {
      question: "How can I become a member?",
      answer:
        "You can begin by visiting the Become a Member page, completing the membership application form, uploading the required documents, accepting the relevant agreements, and completing the application processing payment.",
    },
    {
      question: "Does paying the application fee guarantee membership?",
      answer:
        "No. The application processing fee does not guarantee membership. Every application is reviewed by the appropriate membership committee before an approval decision is made.",
    },
    {
      question: "How much is the membership application processing fee?",
      answer:
        "The current membership application processing fee is $12.00. This fee is for processing the application and is non-refundable.",
    },
    {
      question: "How long does membership approval take?",
      answer:
        "Processing time may vary depending on the review process. Applicants will be contacted using the contact details provided in their application once a decision has been made.",
    },
    {
      question: "Can people outside Nigeria apply?",
      answer:
        "Yes. Ajangbile Heritage welcomes interest from people around the world. The application form supports applicants from different countries.",
    },
    {
      question: "Do i have to be present for the rites and initiation?",
      answer: "Yes, you have to be present as it cannot be done behind you.",
    },
    {
      question: "How can I contact Ajangbile Heritage?",
      answer:
        "You can contact us through the Contact page on this website. Please provide your name, email address, and a clear description of your enquiry.",
    },

    // ======================================================
    // OGBONI FAQS
    // ======================================================

    {
      question: "What is the history of Ogboni?",
      answer:
        "Ogboni from the word Ogbo, which directly translates to the aged, is the branch of ogboni that comprises of elderly men and women in the society which supervises politics and day to day governance of the Yoruba society, so their history is as old as the politics of the Yoruba people. Worthy of note is that there is another translation of the word ogbo, which means a chunk of wood capable of causing damage which serve as the stem for the spiritual faction of ogboni.      Their history is blended with facts and fictions, some parts of it can be traced into Ifa (ogbe ate, irete meji, orangun meji, irosun ogbe, etc.), while some parts of it are stories orally passed down from one ogboni to the other. e.g the story of about the exploits of igbo kokobojo which also has its roots in the odu Ifa oyeku odi. Also, there are stories about Orunmila and his role in the fraternity as an Oluwo and a patron whom helped organize the ikorita of awo which deals with positioning and titles. A book about the full history of ogboni is coming out very soon from Oluwo Ifasakin Ogunorokin.",
    },
    {
      question: "What does Ogboni stand for?",
      answer:
        "Ogboni is traditionally associated with wisdom, integrity, justice, accountability, respect for elders, selflessness and responsibility toward the community.",
    },
    {
      question: "Is Ogboni a religious organization?",
      answer:
        "Yes. Within the traditional Yoruba understanding, Ogboni can be considered an important part of the traditional religious and spiritual system of the Yoruba people. Ogboni has historical connections with Yoruba traditional religious and cultural systems, but its character and practices can vary between traditional institutions and modern organizations.",
    },
    {
      question: "Is Ogboni still relevant today?",
      answer:
        "Yes. Modern Ogboni organizations may focus on cultural preservation, community development, moral values, fellowship, leadership, and maintaining Yoruba heritage. And against all the sustained verbal, oral, economical, political, cultural attacks against the Ogboni fraternity, it has remained resilient and enduring the harshest reality.",
    },
    {
      question: "Who can become a member?",
      answer:
        "Anyone can become a member, and there is no age barrier within Ajangbile Heritage. However, membership requirements may depend on the particular Ogboni organization. Prospective members should contact the organization directly to understand its eligibility requirements.",
    },
    {
      question: "How do I become a member?",
      answer:
        "Membership may involve an application, recommendation, interview, orientation, or other procedures established by the particular organization, but you are advised to make your findings thoroughly before joining a fraternity organization to avoid a cul-de-sac situation.",
    },
    {
      question: "Is membership open to everyone?",
      answer:
        "Yes. Different Ogboni organizations may establish their own membership requirements and admission procedures. At Ajangbile Heritage, membership is open to everyone. Irrespective of your race, tribe, or political affiliation, ogboni belongs to all as it was created by Eledumare to reinforce value in people and also promote love and self awareness",
    },
    {
      question: "Can women become members of Ogboni?",
      answer:
        "Yes. Women can become members of Ogboni and have important roles within Ogboni society and its traditions. as a matter of fact, I do not stand to be corrected, ogboni fraternity revolves around the feminine energy and the supporting masculine energy. so women are encouraged to join as they have a central role in the fraternity.",
    },
    {
      question: "Can a member leave Ogboni?",
      answer:
        "Ogboni is a life long commitment, that is why you are encourage to take a reflective thinking before joining as membership is for life.",
    },
    {
      question: "What is the significance of the Edan Ogboni?",
      answer:
        "The edan is an important traditional symbol associated with Ogboni. Its meaning is connected with authority, identity, spiritual and cultural symbolism, the institution's traditions, and the broader heritage of the Yoruba people. and there are different kinds of edan for different kinds of purposes and also for different kinds of ogboni fraternity.",
    },
    {
      question:
        "What role did Ogboni traditionally play in Yoruba communities?",
      answer:
        "Historically, Ogboni was associated with community governance, consultation, social order, justice, and checks on political authority.",
    },
    {
      question: "Does Ogboni have different ranks or positions?",
      answer:
        "Yes. Ogboni organizations may have different titles, offices, ranks, and leadership structures. These can vary according to the particular institution and its traditions. Different ranks serves different purposes within the ogboni fraternity, with Oluwo being the supreme authority diplomatically and politically, while the Apena represent spiritual authority and Iya Abiye plays the central authority within the fraternity.",
    },
    {
      question: "Are Ogboni ceremonies public?",
      answer:
        "Some Ogboni activities may be public, while certain proceedings, meetings, and membership-related activities may be private.",
    },
    {
      question: "Can Ogboni members practice Christianity or Islam?",
      answer:
        "Ogboni is a non-denominational organization, it has no business with members religion. However it is very important to know that ogboni is an indepedent society on its own with its own religion, cultural values and practices which may be demanding when combined with other religions.",
    },
    {
      question: "Why is Ogboni potrayed in the negative light?",
      answer:
        "Ogboni is considered in the negative light largely due to misinformation and sometimes misrepresentation from unscrupulous element within the ogboni hierarchy. Also, since ogboni fraternity is a secret society, people tend to hate what they do not understand and in most cases the fraternity is unable to defend itself where its representation is been maligned",
    },
    {
      question:
        "Can I attend an Ogboni cultural or educational event without becoming a member?",
      answer:
        "Yes but this depends on the event and organization. Some educational or cultural programs may be open to the public.",
    },
    {
      question: "What is ogboni afiliation program?",
      answer:
        "This is a program where non initiate who agrees completely with the doctrines and tenets of the ogboni fraternity are given the chance to affiliate with ogboni, albeit remotely without having access in the ritual rites and secrets of the fraternity. They may form groups, cell divisions affiliated to a particular branch or Iledi of Ogboni which will serve as their guarantor before the fraternity.",
    },
    {
      question: "What is the difference between RoF and Ogboni Aborigine?",
      answer:
        "This is an highly controversial discussion as RoF exist in the league of their own. From the name reformed ogboni fraternity, it is clear that they do not represent the traditional ogboni fraternity. The major difference between Ogboni fraternity and RoF is that the Ogboni Fraternity and her sister fraternities have kept the tradition of the Yoruba fraternal code keeping it as real as possible. The use of itagbe and titles awarded to members in traditional ogboni is completely different from rof. The rof is an hybrid of the earlier christians and a mix of foreign fraternities syncretised abruptly with the ogboni fraternity for the sake of acceptance and marketability to the local population. It is therefore distinct from the traditional ogboni as their rites and oath does not reflect the accepted standard of the traditional ogboni. The power of rof is in their fraternal bond, their complex structure and the respect they have for their fraternal secret. However, the traditional ogboni has its powers rooted in rites, rituals and raw ancient powers. The rof has no connection to the powerful history and songs of the Yoruba fraternities (ohun ife and aro awo), their rites of initiation, membership, chieftaincy and burial is completely different from the traditional ogboni which follows ancient laid down structure, so if you are looking for a posh, polished, refined fraternity, rof is the better option. However, if you are looking for spiritual empowerment, ancient codes and knowledge, powerful rites and rituals like in the days of our ancestors and primordial irumoles, ogboni aborigine and her sister fraternities are your best bet.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#4b0082] uppercase tracking-[4px] font-semibold">
            Frequently Asked Questions
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-[#4b0082] mt-3">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto mt-5 text-lg leading-8">
            Find answers to some of the most common questions about Ajangbile
            Heritage, Ogboni, membership and our services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-6 text-left px-6 py-5 hover:bg-purple-50 transition"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-bold text-[#4b0082]">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={24}
                    className={`flex-shrink-0 text-[#4b0082] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-8">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
