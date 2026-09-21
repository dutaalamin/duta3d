import type { SoundsData, SoundKey } from "../types";

export const sounds = {} as const satisfies SoundsData;

export const pools = {
  mouseWheel: [],
} as const satisfies Record<string, SoundKey[]>;
