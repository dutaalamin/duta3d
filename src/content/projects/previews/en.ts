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
    description: "Digital Platform",
  },
  {
    title: "Rubic",
    slug: "rubic",
    thumbnail: thumbnailRubic,
    description: "Digital Platform",
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
