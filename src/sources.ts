import contactCharacterModel from "./assets/models/contact-character.fbx";
import heroModel from "./assets/models/hero-character.fbx";
import aboutModel from "./assets/models/about-character.fbx";

export type Source = {
  name: string;
  type: "gltfModel" | "texture" | "fbxModel";
  path: string;
};

export const sources: Source[] = [
  // 3D Characters
  { name: "hero-character", type: "fbxModel", path: heroModel },
  { name: "about-character", type: "fbxModel", path: contactCharacterModel },
  { name: "contact-character", type: "fbxModel", path: aboutModel },
];


