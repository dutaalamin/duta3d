import thumbnail from "../../../assets/thumbnails/wave.png";
import type { ProjectContent } from "../../types";

export default {
  title: "Wave",
  theme: "dark",
  tags: ["react", "next"],
  videoBorder: false,
  live: "https://wavewave.vercel.app/",
  description: "A sleek, modern portfolio website for an architectural and interior design firm, showcasing luxury residential concepts, spatial planning, and clean aesthetic structures.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: thumbnail,
        alt: "Wave Preview",
        caption: "Live View",
      },
    },
  ],
} as const satisfies ProjectContent;
