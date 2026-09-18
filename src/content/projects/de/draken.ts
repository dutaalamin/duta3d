import thumbnail from "../../../assets/thumbnails/draken.png";
import type { ProjectContent } from "../../types";

export default {
  title: "Draken",
  theme: "dark",
  tags: ["react", "css"],
  videoBorder: false,
  live: "https://dutadraken.vercel.app/",
  description: "Software and tools service platform.",
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
