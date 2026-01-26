import LaisaImg from "@/assets/devs/laisa.png";
import DefaultImg from "@/assets/devs/default.png";

export interface Developer {
  name: string;
  role: string;
  website: string;
  image?: string; // 👈 opcional
}

export const developers: Developer[] = [
  {
    name: "Bruno Muller",
    role: "Orientador",
    website: "https://web.inf.ufpr.br/pet/",
    image: DefaultImg,
  },
  {
    name: "Laisa Marcelino",
    role: "Desenvolvedora",
    website: "https://web.inf.ufpr.br/pet/",
    image: LaisaImg,
  },
  {
    name: "Pietro",
    role: "Desenvolvedor",
    website: "https://web.inf.ufpr.br/pet/",
    image: DefaultImg,
  },
  {
    name: "...",
    role: "Desenvolvedora",
    website: "https://web.inf.ufpr.br/pet/",
    image: DefaultImg, 
  },
];
