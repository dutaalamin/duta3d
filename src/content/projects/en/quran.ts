import thumbnail from "../../../assets/thumbnails/dquran.png";
import type { ProjectContent } from "../../types";

export default {
  title: "Quran",
  theme: "dark",
  tags: ["react", "node"],
  videoBorder: false,
  live: "https://dquran.vercel.app/",
  description: "Al-Quran Digital Platform built with modern web technologies.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: thumbnail,
        alt: "Quran Preview",
        caption: "Live View",
      },
    },
  ],
} as const satisfies ProjectContent;
