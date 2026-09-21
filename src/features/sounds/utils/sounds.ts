import { sounds as items, pools } from "../definitions/sounds";
import { sprites } from "../definitions/sprites";
import { isFeatureEnabled } from "../../../utils/features";

import type { SoundKey, PoolKey } from "../types";

export const getSoundsHowl = (sound: SoundKey) => {
  const data = (items as Record<string, any>)[sound];
  if (data && "spriteKey" in data) {
    return (sprites as Record<string, any>)[data.spriteKey]?.howl;
  }
  return data?.howl;
};

//when soundKey is the key of a pool, play a random sound from the pool
const playPoolSound = (poolKey: PoolKey) => {
  const pool = pools[poolKey];
  if (!pool || pool.length === 0) return;
  const randomSound = pool[Math.floor(Math.random() * pool.length)];
  playSound(randomSound as SoundKey);
};

export const playSound = (key: SoundKey | PoolKey) => {
  if (!isFeatureEnabled("sounds")) return;

  if (key in pools) {
    playPoolSound(key as PoolKey);
    return;
  }

  const data = (items as Record<string, any>)[key as SoundKey];
  if (!data) return;

  const howl = getSoundsHowl(key as SoundKey);
  if (!howl) return;

  let id: number | undefined;
  if ("spriteKey" in data) {
    id = howl.play(data.name);
  } else {
    id = howl.play();
  }

  return id;
};
