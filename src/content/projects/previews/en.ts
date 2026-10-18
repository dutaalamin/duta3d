import thumbnailQuran from "../../../assets/thumbnails/dquran.png";
import thumbnailSharkie from "../../../assets/thumbnails/sharkie.webp";
import thumbnailWave from "../../../assets/thumbnails/wave.png";
import thumbnailPokedex from "../../../assets/thumbnails/pokedex.png";
import thumbnailKora from "../../../assets/thumbnails/kora.png";
import thumbnailPacman from "../../../assets/thumbnails/pacman.png";

import type { ProjectPreview } from "../../types";

export default [  {
    title: "Sharkie",
    slug: "sharkie",
    thumbnail: thumbnailSharkie,
    description: "Playable 2D underwater adventure game",
  },
  {
    title: "Pokedex",
    slug: "pokedex",
    thumbnail: thumbnailPokedex,
    description: "Playable Pokemon catching game",
  },
  {
    title: "Pacman",
    slug: "pacman",
    thumbnail: thumbnailPacman,
    description: "Classic 2D Arcade Maze Game",
  },
  {
    title: "Quran",
    slug: "quran",
    thumbnail: thumbnailQuran,
    description: "Al-Quran Digital Platform",
  },
  {
    title: "Kora",
    slug: "kora",
    thumbnail: thumbnailKora,
    description: "AI chat assistant with voice",
  },
  {
    title: "Wave",
    slug: "wave",
    thumbnail: thumbnailWave,
    description: "Architecture & Design Firm",
  },
] as const satisfies ProjectPreview[];
