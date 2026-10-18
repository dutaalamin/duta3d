import type { ProjectContent } from "../../types";

export default {
  title: "Sharkie",
  theme: "dark",
  tags: ["javascript", "canvas", "gsap"],
  videoBorder: false,
  live: "https://sharkie.duta1.com/",
  description:
    "A 2D side-scrolling underwater adventure playable right here. Guide a shark through a parallax ocean, collect coins, dodge jellyfish and pufferfish, and fight a boss at the end of the level. Built with vanilla JavaScript and the Canvas API — no framework, no game engine, just a game loop, sprite animation and collision handling written from scratch. Use the arrow keys or WASD to swim, Space to jump, X to shoot bubbles and Y for a fin slap.",
  components: [
    {
      type: "embed",
      props: {
        src: "https://sharkie.duta1.com/",
        title: "Sharkie — swim, collect coins and defeat the boss",
        caption: "Play it right here",
        ratio: "16 / 9",
      },
    },
    {
      type: "list",
      props: {
        title: "What is in it",
        items: [
          "<b>parallax scenery</b> — five background layers scrolling at different speeds to create depth",
          "<b>sprite animation</b> — hand-timed frame cycles for swimming, attacking, hurt and death states",
          "<b>enemies</b> — jellyfish (regular and electric) and pufferfish that inflate on a timer",
          "<b>combat</b> — bubble projectiles and a fin-slap melee attack, with a poison upgrade",
          "<b>boss fight</b> — an end-of-level encounter with its own attack pattern and health bar",
        ],
      },
    },
    {
      type: "text",
      props: {
        title: "Why it is here",
        text: "The underwater scene on this site is built from this game's assets — the same five parallax layers and the same creature sprites, redrawn here as a living background. It is the clearest example of what I enjoy building: small, self-contained interactive work with no framework in the way.",
      },
    },
  ],
} as const satisfies ProjectContent;
