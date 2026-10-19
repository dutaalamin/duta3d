import type { ProjectContent } from "../../types";

export default {
  title: "Pacman",
  theme: "dark",
  tags: ["javascript", "html"],
  videoBorder: false,
  live: "https://dutapacman.vercel.app/",
  description: "A faithful web recreation of the legendary arcade classic Pac-Man. Navigate through the neon maze, chomp pellets, dodge iconic ghosts, and chase high scores with retro sound effects and authentic arcade gameplay.",
  components: [
    {
      type: "embed",
      props: {
        src: "https://dutapacman.vercel.app/",
        title: "Pacman — classic arcade maze game",
      },
    },
  ],
} as const satisfies ProjectContent;
