import thumbnail from "../../../assets/thumbnails/dquran.png";
import type { ProjectContent } from "../../types";

export default {
  title: "Quran",
  theme: "dark",
  tags: ["react", "node"],
  videoBorder: false,
  live: "https://dquran.vercel.app/",
  description: "A comprehensive digital Al-Quran web platform designed to deliver a serene, accessible reading and study experience. Features include complete Surah indexing, ayah-by-ayah translations, customizable Arabic typography, audio recitations, and a distraction-free interface optimized across all screen sizes.",
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
