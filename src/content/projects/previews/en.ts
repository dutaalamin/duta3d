import thumbnailQuran from "../../../assets/thumbnails/dquran.png";
import thumbnailWave from "../../../assets/thumbnails/wave.png";
import thumbnailRubic from "../../../assets/thumbnails/rubic.png";
import thumbnailPokedex from "../../../assets/thumbnails/pokedex.png";
import thumbnailKora from "../../../assets/thumbnails/kora.png";
import thumbnailPacman from "../../../assets/thumbnails/pacman.png";

import type { ProjectPreview } from "../../types";

export default [
  {
    title: "Quran",
    slug: "quran",
    thumbnail: thumbnailQuran,
    description: "Al-Quran Digital Platform",
  },
  {
    title: "Wave",
    slug: "wave",
    thumbnail: thumbnailWave,
    description: "Architecture & Design Firm",
  },
  {
    title: "Rubic",
    slug: "rubic",
    thumbnail: thumbnailRubic,
    description: "Interactive 3D Rubik's Game",
  },
  {
    title: "Pokedex",
    slug: "pokedex",
    thumbnail: thumbnailPokedex,
    description: "Playable Pokemon catching game",
  },
  {
    title: "Kora",
    slug: "kora",
    thumbnail: thumbnailKora,
    description: "AI chat assistant with voice",
  },
  {
    title: "Pacman",
    slug: "pacman",
    thumbnail: thumbnailPacman,
    description: "Classic 2D Arcade Maze Game",
  },
] as const satisfies ProjectPreview[];
