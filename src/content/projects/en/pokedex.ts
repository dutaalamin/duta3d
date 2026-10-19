import type { ProjectContent } from "../../types";

export default {
  title: "Pokedex",
  theme: "light",
  tags: ["next", "javascript"],
  videoBorder: false,
  live: "https://dutapokedex.vercel.app/",
  description: "A retro Pokemon mini-game playable right here. Press and hold the Poke Ball to charge your throw, release to catch a wild Pokemon, then watch your catches battle it out automatically. Built with Next.js and Tailwind, with sprites streamed from the PokeAPI repository and drifting clouds, flowers and chiptune audio for the classic handheld feel.",
  components: [
    {
      type: "embed",
      props: {
        src: "https://dutapokedex.vercel.app/",
        title: "Pokedex Game — throw the ball and catch Pokemon",
        caption: "Play it right here",
        ratio: "1 / 1",
      },
    },
  ],
} as const satisfies ProjectContent;
