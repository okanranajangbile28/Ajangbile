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
        "Ogboni has its roots in traditional Yoruba society and historically worked alongside traditional rulers and community institutions.",
    },
    {
      question: "What does Ogboni stand for?",
      answer:
        "Ogboni is traditionally associated with wisdom, integrity, justice, accountability, respect for elders, and responsibility toward the community.",
    },
    {
      question: "Is Ogboni a religious organization?",
      answer:
        "Yes. Within the traditional Yoruba understanding, Ogboni can be considered an important part of the traditional religious and spiritual system of the Yoruba people. Ogboni has historical connections with Yoruba traditional religious and cultural systems, but its character and practices can vary between traditional institutions and modern organizations.",
    },
    {
      question: "Is Ogboni still relevant today?",
      answer:
        "Yes. Modern Ogboni organizations may focus on cultural preservation, community development, moral values, fellowship, leadership, and maintaining Yoruba heritage.",
    },
    {
      question: "Who can become a member?",
      answer:
        "Anyone can become a member, and there is no age barrier within Ajangbile Heritage. However, membership requirements may depend on the particular Ogboni organization. Prospective members should contact the organization directly to understand its eligibility requirements.",
    },
    {
      question: "How do I become a member?",
      answer:
        "Membership may involve an application, recommendation, interview, orientation, or other procedures established by the particular organization.",
    },
    {
      question: "Is membership open to everyone?",
      answer:
        "Yes. Different Ogboni organizations may establish their own membership requirements and admission procedures. At Ajangbile Heritage, membership is open to everyone.",
    },
    {
      question: "Can women become members of Ogboni?",
      answer:
        "Yes. Women can become members of Ogboni and have important roles within Ogboni society and its traditions.",
    },
    {
      question: "Can people from outside the Yoruba community join?",
      answer:
        "Yes, people from outside the Yoruba community may be able to join, depending on the organization. Some organizations may have cultural or ancestral requirements, while others may have broader membership criteria.",
    },
    {
      question: "Is there an age requirement for membership?",
      answer:
        "At Ajangbile Heritage, there is no age requirement for membership, and children may also be initiated according to the organization's established traditions and procedures. Requirements may vary with other organizations, so prospective members should confirm the age and eligibility requirements directly with the relevant organization.",
    },
    {
      question: "Do I need to be invited before I can apply?",
      answer:
        "Not necessarily. Some organizations may require sponsorship or recommendation, while others may accept direct expressions of interest.",
    },
    {
      question: "Can a member leave Ogboni?",
      answer:
        "Membership policies differ between organizations. Individuals should discuss withdrawal procedures directly with the relevant organization.",
    },
    {
      question: "What are the main values associated with Ogboni?",
      answer:
        "Commonly emphasized values include wisdom, truth, justice, integrity, respect, accountability, unity, and service to the community.",
    },
    {
      question: "What is the significance of the Ogboni edan?",
      answer:
        "The edan is an important traditional symbol associated with Ogboni. Its meaning is connected with authority, identity, spiritual and cultural symbolism, the institution's traditions, and the broader heritage of the Yoruba people.",
    },
    {
      question: "What role do elders play in Ogboni?",
      answer:
        "Traditionally, elders are associated with wisdom, guidance, dispute resolution, leadership, and the preservation of customs.",
    },
    {
      question:
        "What role did Ogboni traditionally play in Yoruba communities?",
      answer:
        "Historically, Ogboni was associated with community governance, consultation, social order, justice, and checks on political authority.",
    },
    {
      question: "What is the relationship between Ogboni and Yoruba culture?",
      answer:
        "Ogboni is regarded within the traditional Yoruba understanding as an institution that originally played an important role in governing and maintaining order within Yoruba society. It forms an important part of the broader history and cultural heritage of the Yoruba people.",
    },
    {
      question: "Does Ogboni have different ranks or positions?",
      answer:
        "Yes. Ogboni organizations may have different titles, offices, ranks, and leadership structures. These can vary according to the particular institution and its traditions.",
    },
    {
      question: "Are Ogboni ceremonies public?",
      answer:
        "Some Ogboni activities may be public, while certain proceedings, meetings, and membership-related activities may be private.",
    },
    {
      question: 'Are all organizations called "Ogboni" the same?',
      answer:
        "No. Different organizations may use the Ogboni name while having different structures, objectives, beliefs, and practices.",
    },
    {
      question:
        "What is the difference between traditional Ogboni and modern Ogboni organizations?",
      answer:
        "Traditional Ogboni refers to institutions rooted in historical Yoruba society. Modern organizations may adapt aspects of Ogboni heritage to contemporary cultural, social, charitable, or fraternal purposes.",
    },
    {
      question: "Does Ogboni operate outside Nigeria?",
      answer:
        "Yes. Ogboni organizations and Yoruba cultural communities operate outside Nigeria. Many organizations have their headquarters or central structures based in Nigeria, while maintaining members and activities in other countries.",
    },
    {
      question: "Can Ogboni members practice Christianity or Islam?",
      answer:
        "Individual beliefs and organizational policies vary. Anyone considering membership should discuss religious expectations directly with the organization.",
    },
    {
      question: "Why is Ogboni sometimes described as a secret society?",
      answer:
        "Historically, some Ogboni knowledge, meetings, symbols, and proceedings were restricted to members. This privacy has contributed to the description of Ogboni as a secret or esoteric institution.",
    },
    {
      question: "Are all stories about Ogboni true?",
      answer:
        "No. Ogboni has been the subject of numerous stories, rumors, and popular claims. It is important to distinguish documented history and established cultural traditions from speculation or folklore.",
    },
    {
      question: "How can I learn more about Ogboni?",
      answer:
        "You can learn through reputable historical and academic sources, Yoruba cultural organizations, knowledgeable elders, museums, and established Ogboni institutions.",
    },
    {
      question: "How can I contact an Ogboni organization?",
      answer:
        "Use the official contact information provided by the particular organization. Avoid relying on unofficial individuals claiming to represent an organization.",
    },
    {
      question:
        "Can I attend an Ogboni cultural or educational event without becoming a member?",
      answer:
        "This depends on the event and organization. Some educational or cultural programs may be open to the public.",
    },
    {
      question: "How can I get started if I am interested in Ogboni?",
      answer:
        "Begin by learning about its history, cultural significance, values, and the specific organization you are considering. Then contact its official representatives to ask about membership, events, or educational opportunities.",
    },
    {
      question: "What is the difference between RoF and Ogboni Aborigine?",
      answer:
        "RoF is a Christian-based organization that was established by a Christian and operates from a Christian foundation. Ogboni Aborigine, on the other hand, represents the first and traditional Ogboni institution of the Yoruba people. Its origins are deeply rooted in Yoruba history and tradition, and there is no universally established historical record identifying a single individual as its founder. It has been regarded as an institution that has existed as part of Yoruba society and heritage for generations.",
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
