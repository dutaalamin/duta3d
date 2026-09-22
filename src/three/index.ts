import { camera } from "./core/camera";
import { renderer } from "./core/renderer";
import { objects } from "./objects";
import { renderTarget } from "./core/renderTarget";
import { threeSizes } from "./utils/sizes";
import { resources } from "../utils/resources";
import { raycast } from "./utils/raycast";

const init = (_canvas: HTMLCanvasElement) => {
  const setup = () => {
    threeSizes.init(_canvas);
    camera.init();
    renderTarget.init();
    renderer.init(_canvas);

    objects.init();
    raycast.init();
  };

  // `ready` can already have fired before the canvas mounts, so `once` alone
  // would leave the scene permanently uninitialised.
  if (resources.isReady) setup();
  else resources.once("ready", setup);
};

const destroy = () => {
  threeSizes.destroy();
  renderTarget.destroy();
  renderer.destroy();
  objects.destroy();
  camera.destroy();
};

export const three = { init, destroy };
