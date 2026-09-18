import thumbnail from "../../../assets/thumbnails/wave.png";
import type { ProjectContent } from "../../types";

export default {
  title: "Wave",
  theme: "dark",
  tags: ["react", "node"],
  videoBorder: false,
  live: "https://wavewave.vercel.app/",
  description: "Digital Platform focusing on interactive user experiences.",
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
