import contactCharacterModel from "./assets/models/contact-character.fbx";
import aboutModel from "./assets/models/about-character.fbx";

export type Source = {
  name: string;
  type: "gltfModel" | "texture" | "fbxModel";
  path: string;
};

export const sources: Source[] = [
  // 3D characters actually rendered on the site.
  //
  // The "hero-character" asset (~6 MB) was removed: the hero model is permanently
  // disabled in `three/objects/kenney` (`heroGroup.visible = false`), so loading it
  // only wasted bandwidth on every page load. Git history retains it if needed.
  //
  // Note: the name -> file pairing below is intentionally kept as-is (it is swapped
  // relative to the file names); do not "fix" it without verifying the visuals.
  { name: "about-character", type: "fbxModel", path: contactCharacterModel },
  { name: "contact-character", type: "fbxModel", path: aboutModel },
];


