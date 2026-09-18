import thumbnail from "../../../assets/thumbnails/rubic.png";
import type { ProjectContent } from "../../types";

export default {
  title: "Rubic",
  theme: "dark",
  tags: ["react", "postgresql"],
  videoBorder: false,
  live: "https://rubicduta.vercel.app/",
  description: "A robust digital platform designed for scalability.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: thumbnail,
        alt: "Rubic Preview",
        caption: "Live View",
      },
    },
  ],
} as const satisfies ProjectContent;
