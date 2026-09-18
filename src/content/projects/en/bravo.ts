import thumbnail from "../../../assets/thumbnails/bravo.png";
import type { ProjectContent } from "../../types";

export default {
  title: "Bravo",
  theme: "dark",
  tags: ["next", "javascript"],
  videoBorder: false,
  live: "https://dutabravo.vercel.app/",
  description: "AI-powered marketing platform to boost engagement.",
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
