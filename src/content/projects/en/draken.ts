import thumbnail from "../../../assets/thumbnails/draken.png";
import type { ProjectContent } from "../../types";

export default {
  title: "Draken",
  theme: "dark",
  tags: ["react", "javascript"],
  videoBorder: false,
  live: "https://dutadraken.vercel.app/",
  description: "A high-performance software utility and digital tooling hub designed for modern engineers and creative agencies. Features specialized development workflows, responsive management consoles, and modular utilities aimed at simplifying complex technical operations and boosting team productivity.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: thumbnail,
        alt: "Draken Preview",
        caption: "Live View",
      },
    },
  ],
} as const satisfies ProjectContent;
