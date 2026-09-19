import thumbnail from "../../../assets/thumbnails/pacman.png";
import type { ProjectContent } from "../../types";

export default {
  title: "Pacman",
  theme: "dark",
  tags: ["javascript", "html"],
  videoBorder: false,
  live: "https://pacmanduta.vercel.app/",
  description: "A faithful web recreation of the legendary arcade classic Pac-Man. Navigate through the neon maze, chomp pellets, dodge iconic ghosts, and chase high scores with retro sound effects and authentic arcade gameplay.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: thumbnail,
        alt: "Pacman Preview",
        caption: "Live View",
      },
    },
  ],
} as const satisfies ProjectContent;
