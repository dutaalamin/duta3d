import { SRGBColorSpace, TextureLoader } from "three";
import EventEmitter from "./EventEmitter";
import { sources } from "../sources";

import type { Source } from "../sources";
import type { Texture } from "three";

const isProd = import.meta.env.PROD;

/** Everything a `Source` can resolve to, keyed by its `name` in `items`. */
export type LoadedResource = Texture;

/**
 * Asset preloader.
 *
 * The GLTF/Draco/FOX pipeline is gone along with the WebGL scene: the site is
 * plain HTML now, so only textures can be queued here. The class is kept so the
 * preloader still gates the first paint if a source is ever added back.
 */
class Resources extends EventEmitter<{
  ready: void;
  progress: number;
  "source-ready": string;
}> {
  /** Sources that gate the preloader — everything that is not deferred. */
  toLoad = 0;
  isReady = false;
  loaded = 0;
  items: Record<string, LoadedResource> = {};

  private started = false;

  loaders: {
    textureLoader: TextureLoader;
  };

  constructor() {
    super();

    this.loaders = {
      textureLoader: new TextureLoader(),
    };
  }

  startLoading() {
    if (this.started) return;
    this.started = true;

    const critical = sources.filter((source) => !source.deferred);
    const deferred = sources.filter((source) => source.deferred);
    this.toLoad = critical.length;

    // Deferred sources are requested only once the first render is unblocked, so
    // they cannot delay it. Consumers pick them up through `source-ready`.
    const startDeferred = () => {
      for (const source of deferred) this.loadSource(source);
    };

    if (critical.length === 0) {
      this.markReady();
      startDeferred();
      return;
    }

    let remaining = critical.length;
    for (const source of critical) {
      this.loadSource(source, () => {
        this.loaded++;
        this.emit("progress", this.loaded / this.toLoad);

        remaining--;
        if (remaining === 0) {
          this.markReady();
          startDeferred();
        }
      });
    }
  }

  private markReady() {
    this.emit("progress", 1);
    this.isReady = true;
    this.emit("ready");
    this.log("All resources loaded");
  }

  private loadSource(source: Source, onDone?: () => void) {
    const done = () => onDone?.();
    // A single failed asset must never hold the preloader forever.
    const fail = (error: unknown) => {
      console.error(`[Resources] Error loading ${source.type} ${source.name}:`, error);
      done();
    };

    if (source.type === "texture") {
      this.loaders.textureLoader.load(
        source.path,
        (file: Texture) => {
          file.colorSpace = SRGBColorSpace;
          this.sourceLoaded(source, file);
          done();
        },
        undefined,
        fail,
      );
    }
  }

  sourceLoaded(source: Source, file: LoadedResource) {
    this.items[source.name] = file;
    this.emit("source-ready", source.name);
  }

  log(message: string) {
    if (isProd) return;
    console.log(`[Resources] ${message}`);
  }
}

export const resources = new Resources();

// Kick off immediately: nothing on the page waits for a WebGL context any more,
// and `sources` is currently empty so this resolves on the next tick.
resources.startLoading();
