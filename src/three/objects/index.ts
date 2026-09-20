import { kenneyCharacter } from "./kenney";
import { renderer } from "../core/renderer";

const init = () => {
  kenneyCharacter.init();
  renderer.compile();
};

const destroy = () => {
  kenneyCharacter.destroy();
};

export const objects = { init, destroy };

