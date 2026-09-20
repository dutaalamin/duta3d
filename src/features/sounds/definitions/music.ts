import { Howl } from "howler";
import type { MusicTrack } from "../types";

// Empty base64 audio stub so no large music files are bundled
const emptyAudio = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

export const musicTracks = {
  luci: new Howl({ src: [emptyAudio], loop: true, volume: 0, preload: false }),
  about: new Howl({ src: [emptyAudio], loop: true, volume: 0, preload: false }),
} as const;

export const BASE_VOLUMES = {
  luci: 0,
  about: 0,
} as const satisfies Record<MusicTrack, number>;
