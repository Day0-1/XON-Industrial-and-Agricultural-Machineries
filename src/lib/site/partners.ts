export type Partner = {
  id: string;
  name: string;
  shortName: string;
  logoSrc?: string;
};

/** Organizations XON has supplied machinery and services to. */
export const partners: Partner[] = [
  {
    id: "chivita",
    name: "ChiVita",
    shortName: "ChiVita",
    logoSrc: "/logos/chivita.png",
  },
  {
    id: "wholeshield",
    name: "WholeShield Pharmacy",
    shortName: "WholeShield",
    logoSrc: "/logos/wholeshield.png",
  },
  {
    id: "emzor",
    name: "Emzor Pharmaceuticals",
    shortName: "Emzor",
    logoSrc: "/logos/EMZOR.jpeg",
  },
  {
    id: "dangote",
    name: "Dangote",
    shortName: "Dangote",
    logoSrc: "/logos/Dangote_Group_Logo.svg",
  },
];
