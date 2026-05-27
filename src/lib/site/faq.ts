export type FaqItem = {
  question: string;
  answer: string;
};

export const siteFaqs: readonly FaqItem[] = [
  {
    question: "How do I place an order?",
    answer:
      "Browse our products, then contact us on WhatsApp with the machine you are interested in. We confirm pricing, availability, and delivery arrangements with you directly.",
  },
  {
    question: "Do you offer delivery?",
    answer:
      "Yes. Delivery options depend on your location and the equipment ordered. Our team will outline timelines and logistics when you inquire.",
  },
  {
    question: "Can I get specifications before buying?",
    answer:
      "Every product listing includes a description and key details. Message us on WhatsApp for full specifications, photos, or additional documentation.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Payment terms are arranged after your inquiry. We will discuss accepted methods and invoicing when you connect with our team on WhatsApp or email.",
  },
] as const;
