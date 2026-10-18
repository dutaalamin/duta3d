import type { ProjectContent } from "../../types";

export default {
  title: "Pacman",
  theme: "dark",
  tags: ["javascript", "html"],
  videoBorder: false,
  live: "https://pacman.duta1.com/",
  description: "A faithful web recreation of the legendary arcade classic Pac-Man. Navigate through the neon maze, chomp pellets, dodge iconic ghosts, and chase high scores with retro sound effects and authentic arcade gameplay.",
  components: [
    {
      type: "embed",
      props: {
        src: "https://pacman.duta1.com/",
        title: "Pacman — classic arcade maze game",
      },
    },
  ],
} as const satisfies ProjectContent;
