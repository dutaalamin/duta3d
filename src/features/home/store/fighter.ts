export interface FighterCharacter {
  id: "architect";
  name: string;
  subname: string;
  rank: string;
  fightingStyle: string;
  nationality: string;
  height: string;
  skills: SkillGroup[];
  specialty: string;
  avatarPreview: string;
}

/**
 * One labelled row of skills, e.g. "Frontend — Vue · React · TypeScript".
 * Grouping keeps a long list scannable instead of turning the panel into a wall
 * of text, and costs almost no extra height (each row is a single line).
 */
export interface SkillGroup {
  label: string;
  items: string[];
}

/**
 * The single character shown in the About section.
 *
 * There is deliberately no roster / selector any more. A second fighter cost
 * ~50 MB of 3D data and both entries carried near-identical copy, which left
 * visitors asking what the two characters were supposed to mean. One strong
 * identity is clearer and far lighter.
 *
 * `skills` is plain data, so adding or reordering entries never requires a
 * component change. Keep each group short enough to fit on one or two lines.
 */
export const fighter: FighterCharacter = {
  id: "architect",
  name: "DUTA",
  subname: "ARCHITECT",
  rank: "2nd dan",
  fightingStyle: "Creative 3D & Full-Stack Development",
  nationality: "Indonesia",
  height: "180 cm",
  skills: [
    { label: "Frontend", items: ["Vue", "React", "JavaScript", "TypeScript", "SCSS"] },
    { label: "Backend", items: ["Laravel", "PHP"] },
    { label: "3D & Motion", items: ["Three.js", "GSAP", "WebGL"] },
  ],
  specialty: "Interactive WebGL & Scalable Architecture",
  avatarPreview: "/images/card_architect.png?v=3d",
};
