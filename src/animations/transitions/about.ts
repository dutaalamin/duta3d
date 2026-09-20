import { sceneWeightsInOut } from "../scenes";
import { createMatchMedia } from "../utils/matchMedia";
import gsap from "gsap";

let inMM: gsap.MatchMedia | null = null;
let outTl: gsap.core.Timeline | null = null;
let progressMm: gsap.MatchMedia | null = null;
let sectionsMm: gsap.MatchMedia | null = null;
let scenesMm: gsap.MatchMedia | null = null;

export const aboutProgress = { value: 0 };

const setup = ({
  about,
  contentSheet,
}: {
  about: HTMLElement;
  contentSheet: HTMLDivElement;
}) => {
  setupInAnimation(about);
  setupProgressAnimation(about);
  setupSectionsAnimation({
    about,
    contentSheet,
  });
  setupOutAnimation(about);
  setupScenesAnimation(about);
};

const setupProgressAnimation = (about: HTMLElement) => {
  progressMm = createMatchMedia((_context, { isLandscape }) => {
    const tl = gsap.timeline({
      duration: 1,
      scrollTrigger: {
        trigger: about,
        start: isLandscape ? "top bottom" : "top 75%",
        end: "bottom bottom",
        scrub: true,
      },
    });
    const completed = { value: false };
    tl.to(completed, { value: true, duration: 0 }, 1);

    tl.fromTo(aboutProgress, { value: 0 }, { value: 1, duration: 0.95, ease: "none" }, 0);
  });
};

const setupInAnimation = (about: HTMLElement) => {
  inMM = createMatchMedia((_context, { isMobile, isLandscape }) => {
    const tl = gsap.timeline({
      duration: 1,
      scrollTrigger: {
        trigger: about,
        start: isMobile ? "top bottom" : "-=200px bottom",
        end: "top top",
        scrub: true,
      },
    });

    tl.fromTo(sceneWeightsInOut.hero, { out: 0 }, { out: 1, ease: "none", duration: 1 }, 0);

    tl.fromTo(sceneWeightsInOut.about, { in: 0 }, { in: 1, ease: "none", duration: 1 }, 0);
    tl.fromTo(sceneWeightsInOut["about-1"], { in: 0 }, { in: 1, ease: "none", duration: 1 }, 0);

    if (isLandscape) {
      tl.to(
        "#hero-content-inner",
        { x: "27vw", rotate: 4, y: isMobile ? "-5vh" : "10vh", duration: 1, ease: "none" },
        0,
      );
    }
  });
};

const setupOutAnimation = (about: HTMLElement) => {
  outTl = gsap.timeline({
    scrollTrigger: {
      trigger: about,
      start: "bottom bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  outTl.fromTo(sceneWeightsInOut["about"], { out: 0 }, { out: 1, ease: "none", duration: 1 }, 0);
  outTl.fromTo(sceneWeightsInOut["about-2"], { out: 0 }, { out: 1, ease: "none", duration: 1 }, 0);
};

const setupScenesAnimation = (about: HTMLElement) => {
  scenesMm = createMatchMedia((_context) => {
    const tl = gsap.timeline({
      duration: 1,
      scrollTrigger: {
        trigger: about,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    const completed = { value: false };
    tl.to(completed, { value: true, duration: 1 }, 0);

    const delay = 0;
    const multiplier = 0.95;
    const duration = (1 - delay * 2) * multiplier;

    tl.to(sceneWeightsInOut["about-2"], { in: 1, duration: duration, ease: "power1.inOut" }, delay);
    tl.to(sceneWeightsInOut["about-1"], { out: 1, duration: duration, ease: "power1.inOut" }, delay);
  });
};

const setupSectionsAnimation = ({
  about,
  contentSheet,
}: {
  about: HTMLElement;
  contentSheet: HTMLDivElement;
}) => {
  sectionsMm = createMatchMedia((_context, { isLandscape }) => {
    const tl = gsap.timeline({
      duration: 1,
      scrollTrigger: {
        trigger: about,
        start: isLandscape ? "top 35%" : "top 25%",
        end: "bottom bottom",
        scrub: true,
      },
    });

    const completed = { value: false };
    tl.to(completed, { value: true, duration: 0 }, 1);

    if (isLandscape) {
      if (contentSheet) {
        tl.fromTo(contentSheet, { opacity: 0, x: -35 }, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }, 0.1);
      }
    } else {
      if (contentSheet) {
        tl.fromTo(contentSheet, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.1);
      }
    }
  });
};

const destroy = () => {
  if (inMM) inMM.revert();
  if (progressMm) progressMm.revert();
  if (outTl) outTl.revert();
  if (sectionsMm) sectionsMm.revert();
  if (scenesMm) scenesMm.revert();
};

export const about = { setup, destroy };
