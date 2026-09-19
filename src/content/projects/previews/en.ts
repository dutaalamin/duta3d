import thumbnailQuran from "../../../assets/thumbnails/dquran.png";
import thumbnailWave from "../../../assets/thumbnails/wave.png";
import thumbnailRubic from "../../../assets/thumbnails/rubic.png";
import thumbnailBravo from "../../../assets/thumbnails/bravo.png";
import thumbnailDraken from "../../../assets/thumbnails/draken.png";

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
    title: "Bravo",
    slug: "bravo",
    thumbnail: thumbnailBravo,
    description: "AI-powered marketing platform",
  },
  {
    title: "Draken",
    slug: "draken",
    thumbnail: thumbnailDraken,
    description: "Software and tools service platform",
  },
] as const satisfies ProjectPreview[];
