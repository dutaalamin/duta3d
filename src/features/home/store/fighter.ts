export interface FighterProfile {
  name: string;
  fightingStyle: string;
  nationality: string;
  skill: string;
  specialty: string;
  /** Paragraph shown on the right-hand panel, beside the stat sheet. */
  bio: string;
}

/**
 * The single profile shown in the About section.
 *
 * The left panel renders the "fighting game" stat sheet (name + attributes);
 * the right panel renders `bio`. Plain strings on purpose: every field can be
 * edited here without touching a component.
 */
export const fighter: FighterProfile = {
  name: "DUTA",
  fightingStyle: "Creative 3D & Full-Stack Development",
  nationality: "Indonesia",
  skill: "Vue, React, TypeScript, Laravel, Three.js",
  specialty: "Interactive WebGL & Scalable Architecture",
  bio: "I help companies worldwide ship tailor-made software — combining clean code, system engineering and modern design. From business systems to interactive 3D experiences, I care about products that are fast, clean and genuinely enjoyable to use.",
};
