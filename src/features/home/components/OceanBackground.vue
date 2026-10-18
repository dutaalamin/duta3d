<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import gsap from "gsap";
import farBg from "../../../assets/sharkie/landscape/bg/1.png";
import hillsBg from "../../../assets/sharkie/landscape/bg-0/1.png";
import lightBg from "../../../assets/sharkie/landscape/light/1.png";
import nearBg from "../../../assets/sharkie/landscape/bg-1/1.png";
import floorBg from "../../../assets/sharkie/landscape/floor/1.png";
import { projectVisible } from "../../../composables/useRouteObserver";

/**
 * The underwater scene, rebuilt from the Sharkie game.
 *
 * The game is a side-scroller: five background layers scroll at different
 * speeds while a shark swims right and a pufferfish patrols. Nothing here is
 * interactive — it is scenery — so the camera pan is driven by a ticker instead
 * of player input, and the page simply scrolls on top of it.
 *
 * Layer order and parallax factors are copied from `level.class.js` so the
 * composition matches the game exactly (far gradient → hills → light rays →
 * near rocks → coral floor).
 */

type Layer = {
  /** Imported asset URL. */
  src: string;
  /** 0 = static, 1 = moves with the camera. */
  parallax: number;
  /** Extra CSS classes for blend mode / opacity. */
  className?: string;
};

const layers: Layer[] = [
  { src: farBg, parallax: 0.2, className: "layer-far" },
  { src: hillsBg, parallax: 0.5, className: "layer-hills" },
  { src: lightBg, parallax: 0.5, className: "layer-light" },
  { src: nearBg, parallax: 0.8, className: "layer-near" },
  { src: floorBg, parallax: 1, className: "layer-floor" },
];

/** Sprite frames, in order. */
const sharkFrames = Object.values(
  import.meta.glob("../../../assets/sharkie/shark/*.png", { eager: true, import: "default" }),
) as string[];




/** Second jellyfish colour (yellow) — variant 2 of the regular sprite. */
const jellyYellowFrames = Object.values(
  import.meta.glob("../../../assets/sharkie/jelly/2-*.png", { eager: true, import: "default" }),
) as string[];

/** Purple only: variant 1, so the two jellyfish are each a single solid colour. */
const jellyPurpleFrames = Object.values(
  import.meta.glob("../../../assets/sharkie/jelly/1-*.png", { eager: true, import: "default" }),
) as string[];

/** Glob order is not guaranteed, so sort by the numeric frame index. */
const byFrameNumber = (a: string, b: string) => {
  const num = (value: string) => Number(value.match(/(\d+)(?=\.png)/)?.[1] ?? 0);
  return num(a) - num(b);
};

const sorted = (glob: Record<string, unknown>) => (Object.values(glob) as string[]).sort(byFrameNumber);

sharkFrames.sort(byFrameNumber);
jellyPurpleFrames.sort(byFrameNumber);
jellyYellowFrames.sort(byFrameNumber);

/**
 * Pufferfish variants. All three colours from the game are on screen at once,
 * each at its own depth and phase so the scene never looks synchronised.
 */
const pufferSets = [
  {
    key: "red",
    swim: sorted(import.meta.glob("../../../assets/sharkie/puffer/swim/*.png", { eager: true, import: "default" })),
    big: sorted(import.meta.glob("../../../assets/sharkie/puffer/big/*.png", { eager: true, import: "default" })),
    transition: sorted(
      import.meta.glob("../../../assets/sharkie/puffer/transition/*.png", { eager: true, import: "default" }),
    ),
  },
  {
    key: "green",
    swim: sorted(
      import.meta.glob("../../../assets/sharkie/puffer-green/swim/*.png", { eager: true, import: "default" }),
    ),
    big: sorted(import.meta.glob("../../../assets/sharkie/puffer-green/big/*.png", { eager: true, import: "default" })),
    transition: sorted(
      import.meta.glob("../../../assets/sharkie/puffer-green/transition/*.png", { eager: true, import: "default" }),
    ),
  },
  {
    key: "purple",
    swim: sorted(
      import.meta.glob("../../../assets/sharkie/puffer-purple/swim/*.png", { eager: true, import: "default" }),
    ),
    big: sorted(import.meta.glob("../../../assets/sharkie/puffer-purple/big/*.png", { eager: true, import: "default" })),
    transition: sorted(
      import.meta.glob("../../../assets/sharkie/puffer-purple/transition/*.png", { eager: true, import: "default" }),
    ),
  },
] as const;

type PufferState = "swim" | "inflate" | "big" | "deflate";

type Puffer = {
  key: string;
  state: PufferState;
  frame: number;
  /**
   * True while the fish travels right. The puffer art faces LEFT (verified
   * against the source sprites), so travelling right needs `scaleX: -1`.
   */
  facingRight: boolean;
  /** 0 = far/small/slow, 1 = near/big/fast. */
  depth: number;
  /** Seconds for one full crossing. */
  duration: number;
  /** Vertical placement in percent of the viewport. */
  bottom: number;
  el: HTMLElement | null;
  timeline: gsap.core.Timeline | null;
  stateTimer: number | null;
};

const puffers = ref<Puffer[]>([]);

const pufferFrames = (puffer: Puffer) => {
  const set = pufferSets.find((s) => s.key === puffer.key) ?? pufferSets[0];
  if (puffer.state === "big") return set.big;
  if (puffer.state === "inflate" || puffer.state === "deflate") return set.transition;
  return set.swim;
};

const pufferSrc = (puffer: Puffer) => {
  const frames = pufferFrames(puffer);
  return frames[puffer.frame % Math.max(frames.length, 1)] ?? "";
};

/**
 * Placement for each jellyfish. Positions are percentages of the viewport so
 * they scale with the scene; delays keep the bobbing out of sync.
 */
const jellySpots = [
  { cls: "jelly-purple", color: "purple" },
  { cls: "jelly-purple-2", color: "purple" },
  { cls: "jelly-yellow", color: "yellow" },
  { cls: "jelly-yellow-2", color: "yellow" },
] as const;

const rootRef = ref<HTMLElement | null>(null);
const layerRefs = ref<HTMLElement[]>([]);

const sharkFrame = ref(0);
const jellyPurpleFrame = ref(0);
const jellyYellowFrame = ref(0);

/** Camera offset in pixels; each layer multiplies it by its own factor. */
const camera = { x: 0 };

let ticker: (() => void) | null = null;
let sharkTimer: number | null = null;
let jellyTimer: number | null = null;
let pufferTimer: number | null = null;

const setLayerRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) layerRefs.value[index] = el;
};

const setPufferRef = (el: unknown, puffer: Puffer) => {
  if (el instanceof HTMLElement) {
    puffer.el = el;
    return;
  }
  // Vue passes a component instance for component refs; we only render <img>,
  // but the union type still needs narrowing.
  const wrapped = el as { $el?: unknown } | null;
  if (wrapped?.$el instanceof HTMLElement) puffer.el = wrapped.$el;
};

type Bubble = { id: number; left: number; size: number; duration: number; delay: number; drift: number };

let bubbleId = 0;
const bubbles = ref<Bubble[]>([]);

const makeBubble = (): Bubble => ({
  id: bubbleId++,
  left: Math.random() * 100,
  size: 3 + Math.random() * 7,
  duration: 9 + Math.random() * 9,
  delay: Math.random() * 9,
  drift: (Math.random() - 0.5) * 40,
});

/** Bursts spawned by clicking the water, capped so a rapid click cannot flood the DOM. */
const bursts = ref<(Bubble & { top: number })[]>([]);
const MAX_BURSTS = 14;

const spawnBurst = (event: MouseEvent) => {
  if (!rootRef.value) return;
  const rect = rootRef.value.getBoundingClientRect();
  const top = ((event.clientY - rect.top) / rect.height) * 100;
  const left = ((event.clientX - rect.left) / rect.width) * 100;

  for (let i = 0; i < 6; i++) {
    bursts.value.push({
      id: bubbleId++,
      left: left + (Math.random() - 0.5) * 6,
      top: top + (Math.random() - 0.5) * 4,
      size: 4 + Math.random() * 10,
      duration: 3 + Math.random() * 2.5,
      delay: Math.random() * 0.35,
      drift: (Math.random() - 0.5) * 60,
    });
  }

  if (bursts.value.length > MAX_BURSTS) {
    bursts.value = bursts.value.slice(-MAX_BURSTS);
  }
};

let burstTimer: number | null = null;

onMounted(() => {
  bubbles.value = Array.from({ length: 16 }, makeBubble);

  // Three pufferfish at different depths: far/small/slow → near/big/fast.
  puffers.value = [
    { key: "purple", state: "swim", frame: 0, facingRight: true, depth: 0.35, duration: 26, bottom: 62, el: null, timeline: null, stateTimer: null },
    { key: "green", state: "swim", frame: 0, facingRight: true, depth: 0.6, duration: 21, bottom: 40, el: null, timeline: null, stateTimer: null },
    { key: "red", state: "swim", frame: 0, facingRight: true, depth: 1, duration: 17, bottom: 8, el: null, timeline: null, stateTimer: null },
  ];

  // Warm the sprite cache. Frames swap several times per second, and a request
  // that is replaced before it finishes is reported as ERR_ABORTED in the
  // console — harmless, but noisy. Decoding them up front keeps the cycle clean.
  const allFrames = [
    ...sharkFrames,
    ...jellyPurpleFrames,
    ...jellyYellowFrames,
    ...pufferSets.flatMap((set) => [...set.swim, ...set.big, ...set.transition]),
  ];
  for (const src of allFrames) new Image().src = src;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduced) {
    // Continuous camera drift: this is what makes the scene feel like the game
    // rather than a static image. Time-normalised so speed is frame-rate safe.
    const SPEED = 22; // px per second at parallax 1
    let previous = performance.now();

    ticker = () => {
      const now = performance.now();
      const delta = Math.min((now - previous) / 1000, 0.1);
      previous = now;

      camera.x += SPEED * delta;

      // No tiling: each layer is a single `cover` image larger than the
      // viewport, and we only slide its background-position inside that extra
      // space, so the image can never run out at the edges.
      layerRefs.value.forEach((el, index) => {
        if (!el) return;
        const factor = layers[index]?.parallax ?? 1;
        const phase = (camera.x * factor) / 900;
        const position = 50 + Math.sin(phase) * 28 * factor;
        el.style.backgroundPosition = `${position}% bottom`;
      });
    };

    gsap.ticker.add(ticker);

    sharkTimer = window.setInterval(() => {
      sharkFrame.value = (sharkFrame.value + 1) % sharkFrames.length;
    }, 110);

    jellyTimer = window.setInterval(() => {
      jellyPurpleFrame.value = (jellyPurpleFrame.value + 1) % jellyPurpleFrames.length;
      jellyYellowFrame.value = (jellyYellowFrame.value + 1) % jellyYellowFrames.length;
    }, 160);

    // Advance every pufferfish sprite. Deflating plays the transition backwards,
    // exactly like the game.
    pufferTimer = window.setInterval(() => {
      for (const puffer of puffers.value) {
        const frames = pufferFrames(puffer);
        if (!frames.length) continue;
        puffer.frame =
          puffer.state === "deflate"
            ? (puffer.frame - 1 + frames.length) % frames.length
            : (puffer.frame + 1) % frames.length;
      }
    }, 120);

    // Each puffer patrols edge to edge and inflates on its own cycle, staggered
    // so the three colours never move or swell in lockstep.
    // The v-for only creates the <img> elements after `puffers` is assigned, so
    // the patrol has to wait one tick for the refs to exist.
    void nextTick(() => puffers.value.forEach((puffer, index) => {
      const travel = () => window.innerWidth * 1.35;
      const half = puffer.duration / 2;

      // GSAP owns `transform`, so facing is applied with `scaleX` here rather
      // than a CSS class — a CSS `scale` declaration would be overwritten by the
      // inline transform GSAP writes on every tick.
      //
      // IMPORTANT: the puffer art is drawn facing LEFT (the shark faces right).
      // So travelling right needs the mirror and travelling left does not.
      gsap.set(puffer.el, { scaleX: -1 });

      const timeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.6,
        delay: index * 2.4,
      });

      timeline.to(puffer.el, {
        x: () => travel(),
        y: -18,
        duration: half,
        ease: "sine.inOut",
        onStart: () => {
          puffer.facingRight = true;
          gsap.set(puffer.el, { scaleX: -1 });
        },
      });

      timeline.to(puffer.el, {
        x: 0,
        y: 0,
        duration: half,
        ease: "sine.inOut",
        onStart: () => {
          puffer.facingRight = false;
          gsap.set(puffer.el, { scaleX: 1 });
        },
      });

      puffer.timeline = timeline;

      // Inflate / deflate, mirroring the game's `setBigInterval`.
      const cycle = () => {
        if (puffer.state === "swim") {
          puffer.state = "inflate";
          puffer.frame = 0;
          window.setTimeout(() => {
            puffer.state = "big";
            puffer.frame = 0;
          }, 600);
        } else if (puffer.state === "big") {
          puffer.state = "deflate";
          puffer.frame = pufferFrames(puffer).length - 1;
          window.setTimeout(() => {
            puffer.state = "swim";
            puffer.frame = 0;
          }, 600);
        }
      };

      puffer.stateTimer = window.setInterval(cycle, 3800 + index * 900);
    }));
  }

  burstTimer = window.setInterval(() => {
    if (bursts.value.length) bursts.value = [];
  }, 4000);
});

onUnmounted(() => {
  if (ticker) gsap.ticker.remove(ticker);
  ticker = null;
  if (sharkTimer !== null) window.clearInterval(sharkTimer);
  if (pufferTimer !== null) window.clearInterval(pufferTimer);
  if (jellyTimer !== null) window.clearInterval(jellyTimer);
  for (const puffer of puffers.value) {
    if (puffer.stateTimer !== null) window.clearInterval(puffer.stateTimer);
    puffer.timeline?.kill();
  }
  if (burstTimer !== null) window.clearInterval(burstTimer);
});
</script>

<template>
  <div class="ocean" ref="rootRef" :class="{ 'ocean-muted': projectVisible }" aria-hidden="true">
    <!-- Scenery: five tiled layers, each panning at its own speed. -->
    <div
      v-for="(layer, index) in layers"
      :key="layer.src"
      :ref="(el) => setLayerRef(el as Element | null, index)"
      class="ocean-layer"
      :class="layer.className"
      :style="{ backgroundImage: `url(${layer.src})` }"
    ></div>

    <!-- Ambient bubbles -->
    <span
      v-for="bubble in bubbles"
      :key="bubble.id"
      class="bubble"
      :style="{
        left: `${bubble.left}%`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        animationDuration: `${bubble.duration}s`,
        animationDelay: `-${bubble.delay}s`,
        '--drift': `${bubble.drift}px`,
      }"
    ></span>

    <!-- Shark: swims across the scene and loops, like the game intro. -->
    <img
      v-if="sharkFrames.length"
      class="creature shark"
      :src="sharkFrames[sharkFrame]"
      alt=""
      draggable="false"
    />

    <!--
      Three pufferfish (red, green, purple) at different depths. Each patrols
      edge to edge and inflates on its own cycle, so they never move in lockstep.
    -->
    <img
      v-for="puffer in puffers"
      :key="puffer.key"
      :ref="(el) => setPufferRef(el, puffer)"
      class="creature puffer"
      :class="{ 'puffer-inflated': puffer.state === 'big' }"
      :style="{
        bottom: puffer.bottom + '%',
        width: 'clamp(' + (80 + puffer.depth * 50) + 'px, ' + (8 + puffer.depth * 6) + 'vw, ' + (140 + puffer.depth * 60) + 'px)',
        opacity: 0.55 + puffer.depth * 0.45,
      }"
      :src="pufferSrc(puffer)"
      alt=""
      draggable="false"
    />

    <!--
      Four jellyfish: two of each colour, spread across the water column and
      staggered with CSS animation delays so they never pulse together.
    -->
    <img
      v-for="spot in jellySpots"
      :key="spot.cls"
      :class="['creature', 'jelly', spot.cls]"
      :src="spot.color === 'purple' ? jellyPurpleFrames[jellyPurpleFrame] : jellyYellowFrames[jellyYellowFrame]"
      alt=""
      draggable="false"
    />

    <!-- Click the water to release bubbles -->
    <div class="catcher" @click="spawnBurst"></div>
    <span
      v-for="burst in bursts"
      :key="burst.id"
      class="bubble bubble-burst"
      :style="{
        left: `${burst.left}%`,
        top: `${burst.top}%`,
        width: `${burst.size}px`,
        height: `${burst.size}px`,
        animationDuration: `${burst.duration}s`,
        animationDelay: `${burst.delay}s`,
        '--drift': `${burst.drift}px`,
      }"
    ></span>
  </div>
</template>

<style scoped lang="scss">
.ocean {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  background: #2f9dc4;
  transition: filter 0.5s var(--ease-smooth);

  /* Project pages put copy over the scenery, so the water steps back. */
  &-muted {
    filter: brightness(0.4) saturate(0.6) blur(1px);
  }
}

/*
 * Each layer is ONE image scaled to cover the viewport. It is never repeated,
 * so there is no tiling seam; the pan only slides `background-position` inside
 * the overscan.
 */
.ocean-layer {
  position: absolute;
  inset: 0;
  background-repeat: no-repeat;
  background-position: 50% bottom;
  background-size: cover;
  will-change: background-position;
}

.layer-far {
  /* Opaque water gradient: everything else sits on top of it. */
  background-size: cover;
}

.layer-light {
  mix-blend-mode: screen;
  opacity: 0.75;
}

/* ------------------------------------------------------------------ bubbles */
.bubble {
  position: absolute;
  z-index: 2;
  bottom: -20px;
  border-radius: 50%;
  border: 1px solid rgba(190, 235, 255, 0.45);
  background: radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.9), rgba(160, 225, 255, 0.15) 55%, transparent 72%);
  animation-name: bubble-rise;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform, opacity;
}

.bubble-burst {
  bottom: auto;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

@keyframes bubble-rise {
  0% {
    transform: translate(0, 0) scale(0.6);
    opacity: 0;
  }
  12% {
    opacity: 0.85;
  }
  85% {
    opacity: 0.5;
  }
  100% {
    transform: translate(var(--drift, 0), -620px) scale(1.1);
    opacity: 0;
  }
}

/* ---------------------------------------------------------------- creatures */
.creature {
  position: absolute;
  z-index: 3;
  user-select: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.3));
}

.shark {
  width: clamp(120px, 14vw, 210px);
  bottom: 5%;
  left: -22%;
  animation: shark-swim 46s linear infinite;
}

/*
 * The shark crosses the screen facing right, fades out past the edge, then
 * comes back facing left. Fading at the wrap hides the reset — the earlier
 * version flipped `scaleX` mid-screen, which read as the fish snapping around.
 */
@keyframes shark-swim {
  0% {
    transform: translateX(0) scaleX(1);
    opacity: 0;
  }
  4% {
    opacity: 1;
  }
  46% {
    transform: translateX(148vw) scaleX(1);
    opacity: 1;
  }
  50% {
    transform: translateX(148vw) scaleX(1);
    opacity: 0;
  }
  50.01% {
    transform: translateX(148vw) scaleX(-1);
    opacity: 0;
  }
  54% {
    opacity: 1;
  }
  96% {
    transform: translateX(0) scaleX(-1);
    opacity: 1;
  }
  100% {
    transform: translateX(0) scaleX(-1);
    opacity: 0;
  }
}

.puffer {
  /* Matches the shark's visual weight on screen. */
  width: clamp(110px, 13vw, 200px);
  bottom: 12%;
  left: -14%;
  /* Position is driven by GSAP (edge-to-edge patrol); CSS only supplies the
     flip. */
  will-change: transform;
  transition: filter 0.3s var(--ease-smooth);
}

/* A faint glow when inflated, so the state change reads at a glance. */
.puffer-inflated {
  filter: drop-shadow(0 0 18px rgba(255, 170, 140, 0.55));
}

/* Two jellyfish, placed high so the upper water is not empty. */
.jelly {
  width: clamp(52px, 6vw, 92px);
  opacity: 0.85;
  animation: jelly-drift 9s ease-in-out infinite;
}

/* Placed on opposite sides and at different heights so they never crowd. */
.jelly-purple {
  left: 78%;
  bottom: 68%;
}

.jelly-yellow {
  left: 14%;
  bottom: 84%;
  width: clamp(42px, 4.6vw, 70px);
  opacity: 0.7;
  animation-duration: 11s;
  animation-delay: -3.5s;
}

/* Second purple: mid-left, smaller and dimmer, reads as further away. */
.jelly-purple-2 {
  left: 88%;
  bottom: 42%;
  width: clamp(36px, 3.8vw, 58px);
  opacity: 0.5;
  animation-duration: 13s;
  animation-delay: -6s;
}

/* Second yellow: upper-middle, sits between the other two. */
.jelly-yellow-2 {
  left: 46%;
  bottom: 74%;
  width: clamp(34px, 3.4vw, 54px);
  opacity: 0.55;
  animation-duration: 10s;
  animation-delay: -1.5s;
}

/* Jellyfish hover in place, so a vertical bob is the natural motion here. */
@keyframes jelly-drift {
  0%,
  100% {
    transform: translateY(0) rotate(-3deg);
  }
  50% {
    transform: translateY(-34px) rotate(3deg);
  }
}

/* ------------------------------------------------------------------ catcher */
.catcher {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: auto;
  cursor: crosshair;
}

/* On phones the creatures would sit behind the cards, so they are hidden. */
@media (max-width: 767px) {
  .shark {
    width: 130px;
    bottom: 26%;
  }

  .puffer {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bubble,
  .shark,
  .puffer {
    animation: none !important;
  }
}
</style>
