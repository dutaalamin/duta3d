/**
 * Sources loaded before the page is revealed.
 *
 * The 3D character models that used to live here are gone: the site no longer
 * renders a WebGL scene, so nothing is left to preload. The array is kept (and
 * stays empty) so `Resources` and the preloader keep working unchanged, and so
 * future textures can be added without touching the loading pipeline.
 */

export type Source = {
  name: string;
  type: "gltfModel" | "texture";
  path: string;
  /**
   * Loaded only after everything that gates the first render is in, so it never
   * competes with it for bandwidth.
   */
  deferred?: boolean;
};

export const sources: Source[] = [];
