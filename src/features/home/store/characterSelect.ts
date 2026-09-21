import { ref, computed } from "vue";
import type { ComputedRef } from "vue";

export interface FighterCharacter {
  id: "architect" | "striker";
  name: string;
  subname: string;
  rank: string;
  fightingStyle: string;
  nationality: string;
  height: string;
  weight: string;
  specialty: string;
  badge: string;
  iconName: string;
  avatarPreview: string;
}

export const fighters: FighterCharacter[] = [
  {
    id: "architect",
    name: "DUTA",
    subname: "ARCHITECT",
    rank: "2nd dan",
    fightingStyle: "Creative 3D & Full-Stack Development",
    nationality: "Indonesia",
    height: "175 cm",
    weight: "68 kg",
    specialty: "Interactive WebGL & Scalable Architecture",
    badge: "P1",
    iconName: "DEV",
    avatarPreview: "/images/card_architect.png?v=3d",
  },
  {
    id: "striker",
    name: "DUTA",
    subname: "STRIKER",
    rank: "Tekken God",
    fightingStyle: "Mishima-Style Karate & High-Performance Code",
    nationality: "Indonesia",
    height: "183 cm",
    weight: "82 kg",
    specialty: "Zero-Latency Execution & Electric Code",
    badge: "P2",
    iconName: "FGT",
    avatarPreview: "/images/card_striker.png?v=3d",
  },
];

export const activeFighterId = ref<"architect" | "striker">("architect");

export const activeFighter: ComputedRef<FighterCharacter> = computed(() => {
  return fighters.find((f) => f.id === activeFighterId.value) ?? fighters[0]!;
});

export const isFighterLoading = ref(false);
