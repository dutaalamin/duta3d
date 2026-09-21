import { Howl } from "howler";
import type { SpritesData } from "../types";

const dummyAudio = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

export const sprites = {
  contact: { howl: new Howl({ src: [dummyAudio], preload: false }) },
  room: { howl: new Howl({ src: [dummyAudio], preload: false }) },
} as const satisfies SpritesData;
