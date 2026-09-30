<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import gsap from "gsap";
import { t } from "../../../i18n/utils/translate";

const heroRef = ref<HTMLElement | null>(null);
let tl: gsap.core.Timeline | null = null;

onMounted(() => {
  const hero = heroRef.value;
  const wrapper = document.querySelector<HTMLElement>(".intro-wrapper");
  const panel = document.querySelector<HTMLElement>(".intro-about-container");
  if (!hero || !wrapper) return;

  // Dua layar berbagi satu panggung 3D: layar pertama sapaan (HOME), layar
  // kedua profil karakter (ABOUT). Keduanya bergantian lewat opacity supaya
  // tidak pernah terlihat bersamaan, lalu memudar sebelum Projects masuk.
  //
  // Panggung lebih pendek dari sebelumnya, dan bagian Projects sengaja berada
  // di atas panggung intro (z-index lebih tinggi). Jadi About tidak perlu
  // memudar: cukup biarkan kartu Projects naik dan menutupinya. Dengan begitu
  // selalu ada isi di layar — tidak pernah muncul area hitam kosong.
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
    defaults: { ease: "none" },
  });

  // 0.00 - 0.15  HOME memudar
  tl.to(hero, { opacity: 0, y: -50, duration: 0.15 });

  if (panel) {
    gsap.set(panel, { opacity: 0 });
    // 0.10 - 0.35  ABOUT muncul menggantikan HOME, lalu tetap terlihat
    //              sampai kartu Projects naik menutupinya
    tl.to(panel, { opacity: 1, duration: 0.25 });
    tl.to({}, { duration: 0.65 });
  } else {
    tl.to({}, { duration: 0.85 });
  }
});

onUnmounted(() => {
  tl?.scrollTrigger?.kill();
  tl?.kill();
  tl = null;
});
</script>

<template>
  <div class="hero-wrapper" ref="heroRef">
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="hero-title-line">Duta</span>
        <span class="hero-title-line">Alamin</span>
      </h1>

      <span class="hero-role">{{ t("hero-eyebrow") }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hero-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: calc(var(--lvh) * 100);
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 12;
}

.hero-content {
  padding-left: clamp(24px, 6vw, 90px);
  pointer-events: auto;
  animation: hero-masuk 1s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

@keyframes hero-masuk {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.hero-title {
  margin: 0;
  font-family: "Urbanist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.hero-title-line {
  display: block;
  font-size: clamp(52px, 7.5vw, 96px);
  font-weight: 900;
  font-style: italic;
  line-height: 0.94;
  letter-spacing: -0.5px;
  color: #ffffff;
  text-shadow:
    0 2px 12px rgba(0, 0, 0, 0.9),
    0 0 44px rgba(255, 0, 85, 0.28);
}

/* Badge "SOFTWARE ENGINEER" — mengikuti gaya label About */
.hero-role {
  display: inline-block;
  margin-top: 22px;
  padding: 6px 14px;
  background: #ff0055;
  color: #ffffff;
  font-size: clamp(11px, 1vw, 13px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2.4px;
  border-radius: 2px;
  box-shadow: 0 3px 14px rgba(255, 0, 85, 0.45);
  /* Sedikit miring seperti stiker */
  transform: rotate(-1.2deg);
}
</style>
