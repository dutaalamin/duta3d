export interface FighterCharacter {
  name: string;
  fightingStyle: string;
  nationality: string;
  height: string;
  skill: string;
  specialty: string;
}

/**
 * The single character shown in the About section.
 *
 * There is deliberately no roster / selector any more. A second fighter cost
 * ~50 MB of 3D data and both entries carried near-identical copy, which left
 * visitors asking what the two characters were supposed to mean. One strong
 * identity is clearer and far lighter.
 *
 * `skill` is a plain string so it can be edited without touching any component.
 * Keep it to roughly 8-10 entries; beyond that it wraps to three lines and the
 * panel starts to look crowded.
 */
export const fighter: FighterCharacter = {
  name: "DUTA",
  fightingStyle: "Creative 3D & Full-Stack Development",
  nationality: "Indonesia",
  height: "180 cm",
  skill: "Vue, React, TypeScript, Laravel, Three.js",
  specialty: "Interactive WebGL & Scalable Architecture",
};
