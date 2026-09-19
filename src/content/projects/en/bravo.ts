import thumbnail from "../../../assets/thumbnails/bravo.png";
import type { ProjectContent } from "../../types";

export default {
  title: "Bravo",
  theme: "dark",
  tags: ["next", "javascript"],
  videoBorder: false,
  live: "https://dutabravo.vercel.app/",
  description: "An intelligent AI-driven marketing and brand amplification platform built to streamline creative copywriting, audience segmentation, and automated growth campaigns. Engineered with modern full-stack web architecture to empower businesses with high-converting digital assets and real-time performance analytics.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: thumbnail,
        alt: "Bravo Preview",
        caption: "Live View",
      },
    },
  ],
} as const satisfies ProjectContent;
