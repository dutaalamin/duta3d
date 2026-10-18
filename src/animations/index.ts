import { scenes } from "./scenes";
import { intro } from "./intro";

/**
 * Scroll-driven state shared by the sound mixer.
 *
 * The 3D scene graph is gone, so there are no waypoints or camera transitions
 * left to run here — only the scene weights, which `useMusic` and `room` still
 * read to cross-fade tracks as the page moves from hero to about.
 */

let isInitialized = false;

const init = () => {
  if (isInitialized) return;
  scenes.init();
  intro.play();
  isInitialized = true;
};

const destroy = () => {
  if (!isInitialized) return;
  scenes.destroy();
  isInitialized = false;
};

export const animations = { init, destroy };
