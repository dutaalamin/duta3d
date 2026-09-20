import { resources } from "../../../utils/resources";
import {
  Group,
  AnimationMixer,
  LoopRepeat,
  Mesh,
  SRGBColorSpace,
  Vector3,
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
const heroGroup = new Group();
const aboutGroup = new Group();
const contactGroup = new Group();

// Mixers and actions
let heroMixer: AnimationMixer | null = null;
let heroCurrentAction: any = null;
let heroMeshRef: Group | null = null;

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

// Fixed default center position for Hero character
const floorHeight = 0.65;
export const characterPos = new Vector3(0.25, floorHeight, 0.35);

const init = () => {
  // Lighting for Hero character
  const heroAmbientLight = new AmbientLight(0xffffff, 2.8);
  const heroDirLight = new DirectionalLight(0xf0f7ff, 2.0);
  heroDirLight.position.set(2, 6, 3);
  heroGroup.add(heroAmbientLight);
  heroGroup.add(heroDirLight);

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

  initHeroCharacter();
  initAboutCharacter();
  initContactCharacter();
  preloadStrikerCharacter();

  rootGroup.add(heroGroup);
  rootGroup.add(aboutGroup);
  rootGroup.add(contactGroup);
  scene.instance.add(rootGroup);

  updateTransforms();
  updateModelVisibility();
  gsap.ticker.add(tick);
};

// 1. Hero Character: Swing To Land (Fixed default center position)
const initHeroCharacter = () => {
  const fbx = resources.items["hero-character"];
  if (!fbx) {
    console.warn("[Kenney] hero-character (Swing To Land) FBX not loaded yet");
    return;
  }

  const heroMesh = cloneSkeleton(fbx) as Group;
  heroMesh.renderOrder = 25;

  heroMesh.traverse((child) => {
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

  heroMeshRef = heroMesh;
  heroMixer = new AnimationMixer(heroMesh);

  if (fbx.animations && fbx.animations.length > 0) {
    const swingClip = fbx.animations[0];
    heroCurrentAction = heroMixer.clipAction(swingClip);
    heroCurrentAction.loop = LoopRepeat;
    heroCurrentAction.play();
  }

  heroGroup.add(heroMesh);
};

// 2. About Character: Idle (Default: Architect)
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
  // Hero Character Transform: fixed center position, 0° front facing
  heroGroup.position.copy(characterPos);
  heroGroup.rotation.set(0, 0, 0);

  // About Character Transform: positioned on right side in landscape, center in portrait
  const isLandscape = typeof window !== "undefined" ? window.innerWidth >= window.innerHeight : true;
  aboutGroup.position.set(isLandscape ? 0.65 : 0, 0.4, 6);
  aboutGroup.rotation.set(0, 0, 0);
  if (aboutMeshRef) {
    aboutMeshRef.position.set(0, 0.08, 0);
  }
  if (strikerMeshRef) {
    strikerMeshRef.position.set(0, 0.08, 0);
  }

  // Contact Character Transform: fixed contact position, 0° front facing
  contactGroup.position.set(0.3, -12.6, 0.5);
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

  // HERO vs ABOUT: Strictly mutually exclusive to eliminate overlap / collision
  const heroOut = sceneWeightsInOut.hero.out;
  const isHero = heroOut < 0.4;
  heroGroup.visible = isHero;

  if (isHero && heroMeshRef) {
    const fadeOutProgress = Math.min(1, Math.max(0, (heroOut - 0.15) / 0.25));
    const heroScale = 0.0155 * (1 - fadeOutProgress);
    heroMeshRef.scale.set(heroScale, heroScale, heroScale);
  }

  // ABOUT: Visible only after Hero is exited (>= 0.4) and while in About
  const isAbout = heroOut >= 0.4 && sceneWeights.contact < 0.2 && sceneWeightsInOut.about.out < 0.9;
  aboutGroup.visible = isAbout;

  if (isAbout) {
    const fadeInProgress = Math.min(1, Math.max(0, (heroOut - 0.4) / 0.25));
    if (aboutMeshRef && aboutMeshRef.visible) {
      const aboutScale = 0.016 * fadeInProgress * fighterScaleTransition.architect;
      aboutMeshRef.scale.set(aboutScale, aboutScale, aboutScale);
    }
    if (strikerMeshRef && strikerMeshRef.visible) {
      const strikerScale = 0.0155 * fadeInProgress * fighterScaleTransition.striker;
      strikerMeshRef.scale.set(strikerScale, strikerScale, strikerScale);
    }
  }

  contactGroup.visible = sceneWeights.contact > 0.001;
};

const tick = (_time: number, deltaTime: number) => {
  updateModelVisibility();

  const dt = Math.min(deltaTime / 1000, 0.1);

  if (isKenneyActive.value) {
    // Hero character animation update
    if (heroGroup.visible && heroMixer) {
      heroGroup.position.copy(characterPos);
      heroGroup.rotation.set(0, 0, 0);
      heroMixer.update(dt);
    }

    // About character animation update
    if (aboutGroup.visible) {
      const isLandscape = typeof window !== "undefined" ? window.innerWidth >= window.innerHeight : true;
      aboutGroup.position.x = isLandscape ? 0.65 : 0;
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

  if (heroMixer) heroMixer.stopAllAction();
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
