export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    id: "chivita",
    quote:
      "XON supplied equipment for our production line. Clear quotes on WhatsApp and delivery was on schedule.",
    name: "ChiVita",
    role: "Procurement",
    rating: 5,
  },
  {
    id: "wholeshield",
    quote:
      "We got reliable machines for our stores. Good support from inquiry to handover.",
    name: "WholeShield Pharmacy",
    role: "Operations",
    rating: 5,
  },
  {
    id: "emzor",
    quote:
      "Straightforward process. XON helped us source the right industrial equipment for our facility.",
    name: "Emzor Pharmaceuticals",
    role: "Facilities",
    rating: 5,
  },
  {
    id: "dangote",
    quote:
      "Dependable machinery and honest pricing. A solid partner for our equipment needs.",
    name: "Dangote",
    role: "Supply Chain",
    rating: 5,
  },
];
