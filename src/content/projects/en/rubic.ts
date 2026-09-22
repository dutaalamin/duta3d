import type { ProjectContent } from "../../types";

export default {
  title: "Rubic",
  theme: "dark",
  tags: ["three", "react"],
  videoBorder: false,
  live: "https://rubicduta.vercel.app/",
  description: "An interactive 3D Rubik's Cube game built with Three.js, featuring smooth cube rotations, intuitive manipulation controls, and responsive spatial puzzle mechanics.",
  components: [
    {
      type: "embed",
      props: {
        src: "https://rubicduta.vercel.app/",
        title: "Rubic — interactive 3D Rubik's Cube",
      },
    },
  ],
} as const satisfies ProjectContent;
