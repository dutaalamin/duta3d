import { resources } from "../../../utils/resources";
import {
  Group,
  AnimationMixer,
  LoopRepeat,
  Mesh,
  SRGBColorSpace,
  AmbientLight,
  DirectionalLight,
} from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import { scene } from "../../core/scene";
import gsap from "gsap";
import { ref } from "vue";
import { sceneWeights, sceneWeightsInOut } from "../../../animations/scenes";
import { activeFighterId, isFighterLoading } from "../../../features/home/store/characterSelect";

export const isKenneyActive = ref(true);

const rootGroup = new Group();
const aboutGroup = new Group();
const contactGroup = new Group();

// Mixers and actions
let aboutMixer: AnimationMixer | null = null;
let aboutCurrentAction: any = null;
let aboutMeshRef: Group | null = null;

// New fighter character (Striker from Fighting.fbx)
let strikerMeshRef: Group | null = null;
let strikerMixer: AnimationMixer | null = null;
let strikerCurrentAction: any = null;
let currentFighterId: "architect" | "striker" = "architect";

let contactMixer: AnimationMixer | null = null;
let contactCurrentAction: any = null;
let contactMeshRef: Group | null = null;

const init = () => {
  // Lighting for About character (Crisp AAA character showcase)
  const aboutAmbientLight = new AmbientLight(0xffffff, 2.8);
  const aboutDirLight = new DirectionalLight(0xe0f2fe, 2.2);
  aboutDirLight.position.set(2, 6, 5);
  aboutDirLight.target.position.set(0, 1.5, 0);
  aboutGroup.add(aboutAmbientLight);
  aboutGroup.add(aboutDirLight);
  aboutGroup.add(aboutDirLight.target);

  // Lighting for Contact character
  const contactAmbientLight = new AmbientLight(0xffffff, 2.8);
  const contactDirLight = new DirectionalLight(0xf0f7ff, 2.0);
  contactDirLight.position.set(2, 6, 3);
  contactGroup.add(contactAmbientLight);
  contactGroup.add(contactDirLight);

  initAboutCharacter();
  initContactCharacter();

  // The striker model (~50 MB) is intentionally NOT preloaded here. It is fetched
  // on demand by `switchAboutFighter` the first time the visitor picks that fighter,
  // which keeps the initial page load light. See `preloadStrikerCharacter`.

  rootGroup.add(aboutGroup);
  rootGroup.add(contactGroup);
  scene.instance.add(rootGroup);

  updateTransforms();
  updateModelVisibility();
  gsap.ticker.add(tick);
};

// 1. About Character: Idle (Default: Architect)
const initAboutCharacter = () => {
  const fbx = resources.items["about-character"];
  if (!fbx) {
    console.warn("[Kenney] about-character (Idle) FBX not loaded yet");
    return;
  }

  const aboutMesh = cloneSkeleton(fbx) as Group;
  aboutMesh.renderOrder = 26;

  aboutMesh.traverse((child) => {
    if (child instanceof Mesh) {
      child.frustumCulled = false;
      child.renderOrder = 26;
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => {
            m.depthTest = true;
            m.depthWrite = true;
            m.transparent = false;
            m.opacity = 1;
            if (m.map) m.map.colorSpace = SRGBColorSpace;
          });
        } else {
          child.material.depthTest = true;
          child.material.depthWrite = true;
          child.material.transparent = false;
          child.material.opacity = 1;
          if (child.material.map) child.material.map.colorSpace = SRGBColorSpace;
        }
      }
    }
  });

  aboutMeshRef = aboutMesh;
  aboutMixer = new AnimationMixer(aboutMesh);

  // Play Idle animation
  if (fbx.animations && fbx.animations.length > 0) {
    const idleClip = fbx.animations[0];
    aboutCurrentAction = aboutMixer.clipAction(idleClip);
    aboutCurrentAction.loop = LoopRepeat;
    aboutCurrentAction.play();
  }

  aboutGroup.add(aboutMesh);
};

const fighterScaleTransition = { architect: 1, striker: 0 };
let isPreloadingStriker = false;
const preloadCallbacks: Array<(mesh: Group) => void> = [];

export const preloadStrikerCharacter = (onReady?: (mesh: Group) => void) => {
  if (strikerMeshRef) {
    onReady?.(strikerMeshRef);
    return;
  }
  if (onReady) {
    preloadCallbacks.push(onReady);
  }
  if (isPreloadingStriker) return;
  isPreloadingStriker = true;

  const loader = new FBXLoader();
  loader.load(
    "/models/fighter-character.fbx",
    (fbx) => {
      const strikerMesh = cloneSkeleton(fbx) as Group;
      strikerMesh.renderOrder = 26;

      strikerMesh.traverse((child) => {
        if (child instanceof Mesh) {
          child.frustumCulled = false;
          child.renderOrder = 26;
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((m) => {
              m.depthTest = true;
              m.depthWrite = true;
              if (m.map) m.map.colorSpace = SRGBColorSpace;
            });
          }
        }
      });

      strikerMeshRef = strikerMesh;
      strikerMesh.position.set(0, 0.08, 0);
      strikerMesh.scale.set(0, 0, 0);
      strikerMesh.visible = false;
      strikerMixer = new AnimationMixer(strikerMesh);

      if (fbx.animations && fbx.animations.length > 0 && fbx.animations[0]) {
        const fightClip = fbx.animations[0];
        strikerCurrentAction = strikerMixer.clipAction(fightClip);
        strikerCurrentAction.loop = LoopRepeat;
        strikerCurrentAction.play();
      }

      aboutGroup.add(strikerMesh);
      isPreloadingStriker = false;
      isFighterLoading.value = false;

      while (preloadCallbacks.length > 0) {
        const cb = preloadCallbacks.shift();
        cb?.(strikerMesh);
      }
    },
    undefined,
    (err) => {
      console.error("[Fighter] Error preloading fighter-character.fbx:", err);
      isPreloadingStriker = false;
      isFighterLoading.value = false;
    }
  );
};

// Character Switcher for About Section
export const switchAboutFighter = (id: "architect" | "striker") => {
  if (id === currentFighterId) return;
  currentFighterId = id;
  activeFighterId.value = id;

  if (id === "architect") {
    gsap.killTweensOf(fighterScaleTransition);
    gsap.to(fighterScaleTransition, {
      striker: 0,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        if (strikerMeshRef) strikerMeshRef.visible = false;
        if (aboutMeshRef) {
          aboutMeshRef.visible = true;
          gsap.to(fighterScaleTransition, {
            architect: 1,
            duration: 0.35,
            ease: "back.out(1.5)",
          });
        }
      },
    });
  } else if (id === "striker") {
    if (strikerMeshRef) {
      gsap.killTweensOf(fighterScaleTransition);
      gsap.to(fighterScaleTransition, {
        architect: 0,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          if (aboutMeshRef) aboutMeshRef.visible = false;
          if (strikerMeshRef) {
            strikerMeshRef.visible = true;
            gsap.to(fighterScaleTransition, {
              striker: 1,
              duration: 0.35,
              ease: "back.out(1.5)",
            });
          }
        },
      });
    } else {
      isFighterLoading.value = true;
      preloadStrikerCharacter((mesh) => {
        isFighterLoading.value = false;
        if (currentFighterId === "striker") {
          gsap.killTweensOf(fighterScaleTransition);
          gsap.to(fighterScaleTransition, {
            architect: 0,
            duration: 0.18,
            ease: "power2.in",
            onComplete: () => {
              if (aboutMeshRef) aboutMeshRef.visible = false;
              mesh.visible = true;
              gsap.to(fighterScaleTransition, {
                striker: 1,
                duration: 0.35,
                ease: "back.out(1.5)",
              });
            },
          });
        }
      });
    }
  }
};

// 3. Contact Character: Fighting Idle
const initContactCharacter = () => {
  const fbx = resources.items["contact-character"];
  if (!fbx) {
    console.warn("[Kenney] contact-character (Fighting Idle) FBX not loaded yet");
    return;
  }

  const contactMesh = cloneSkeleton(fbx) as Group;
  contactMesh.renderOrder = 25;

  contactMesh.traverse((child) => {
    if (child instanceof Mesh) {
      child.frustumCulled = false;
      child.renderOrder = 25;
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => {
            if (m.map) m.map.colorSpace = SRGBColorSpace;
          });
        } else if (child.material.map) {
          child.material.map.colorSpace = SRGBColorSpace;
        }
      }
    }
  });

  contactMeshRef = contactMesh;
  contactMixer = new AnimationMixer(contactMesh);

  // Play Fighting Idle animation
  if (fbx.animations && fbx.animations.length > 0) {
    const fightClip = fbx.animations[0];
    contactCurrentAction = contactMixer.clipAction(fightClip);
    contactCurrentAction.loop = LoopRepeat;
    contactCurrentAction.play();
  }

  contactGroup.add(contactMesh);
};

const updateTransforms = () => {
  // About Character Transform: centered on the about camera focus, 0° front facing
  // x must stay 0 — the about waypoint camera looks straight at x = 0, so any
  // offset shifts the character off-center horizontally.
  aboutGroup.position.set(0, 0.45, 6);
  aboutGroup.rotation.set(0, 0, 0);
  if (aboutMeshRef) {
    aboutMeshRef.position.set(0, 0.08, 0);
  }
  if (strikerMeshRef) {
    strikerMeshRef.position.set(0, 0.08, 0);
  }

  // Contact Character Transform: centered on the contact camera focus, 0° front facing
  // x must stay 0 — the contact camera looks straight at x = 0, so any offset
  // shifts the character off-center horizontally.
  contactGroup.position.set(0, -12.6, 0.5);
  contactGroup.rotation.set(0, 0, 0);
  if (contactMeshRef) {
    contactMeshRef.scale.set(0.018, 0.018, 0.018);
  }
};

const updateModelVisibility = () => {
  if (!isKenneyActive.value) {
    rootGroup.visible = false;
    aboutGroup.visible = false;
    return;
  }

  rootGroup.visible = true;

  // ABOUT: Visible directly at top of page until user reaches Contact section
  const isAbout = sceneWeights.contact < 0.2 && sceneWeightsInOut.about.out < 0.9;
  aboutGroup.visible = isAbout;

  if (isAbout) {
    if (aboutMeshRef && aboutMeshRef.visible) {
      const aboutScale = 0.0205 * fighterScaleTransition.architect;
      aboutMeshRef.scale.set(aboutScale, aboutScale, aboutScale);
    }
    if (strikerMeshRef && strikerMeshRef.visible) {
      const strikerScale = 0.020 * fighterScaleTransition.striker;
      strikerMeshRef.scale.set(strikerScale, strikerScale, strikerScale);
    }
  }

  contactGroup.visible = sceneWeights.contact > 0.001;
};

const tick = (_time: number, deltaTime: number) => {
  updateModelVisibility();

  const dt = Math.min(deltaTime / 1000, 0.1);

  if (isKenneyActive.value) {
    // About character animation update
    if (aboutGroup.visible) {
      aboutGroup.position.x = 0;
      if (currentFighterId === "architect" && aboutMixer) {
        aboutMixer.update(dt);
      } else if (currentFighterId === "striker" && strikerMixer) {
        strikerMixer.update(dt);
      }
    }

    // Contact character animation update
    if (contactGroup.visible && contactMixer) {
      contactMixer.update(dt);
    }
  }
};

const destroy = () => {
  gsap.ticker.remove(tick);

  if (aboutMixer) aboutMixer.stopAllAction();
  if (strikerMixer) strikerMixer.stopAllAction();
  if (contactMixer) contactMixer.stopAllAction();
};

export const kenneyCharacter = {
  init,
  destroy,
  updateTransforms,
  switchAboutFighter,
  rootGroup,
};
