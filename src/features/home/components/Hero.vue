<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import gsap from "gsap";
import { t } from "../../../i18n/utils/translate";

const heroRef = ref<HTMLElement | null>(null);
let tl: gsap.core.Timeline | null = null;

const ke = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

onMounted(() => {
  const el = heroRef.value;
  if (!el) return;

  // Hero memudar saat halaman mulai digulir ke bawah
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#about",
      start: "top top",
      end: "35% top",
      scrub: true,
    },
  });
  tl.to(el, { opacity: 0, y: -50, ease: "none" }, 0);
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
      <p class="hero-eyebrow">{{ t("hero-eyebrow") }}</p>

      <h1 class="hero-title">
        <span class="hero-title-line">DUTA</span>
        <span class="hero-title-sub">Alamin</span>
      </h1>

      <p class="hero-lead">{{ t("hero-lead") }}</p>

      <div class="hero-actions">
        <button class="hero-btn hero-btn-primary" data-sound="click" @click="ke('projects')">
          {{ t("view-work") }}
        </button>
        <button class="hero-btn hero-btn-ghost" data-sound="click" @click="ke('contact')">
          {{ t("get-in-touch") }}
        </button>
      </div>
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
  max-width: 560px;
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

.hero-eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #ff0055;
  margin: 0 0 14px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
}

.hero-title {
  margin: 0;
  line-height: 0.88;
  font-family: "Urbanist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.hero-title-line {
  display: block;
  font-size: clamp(54px, 8vw, 104px);
  font-weight: 900;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #ffffff;
  text-shadow:
    0 2px 12px rgba(0, 0, 0, 0.9),
    0 0 44px rgba(255, 0, 85, 0.3);
}

.hero-title-sub {
  display: block;
  font-size: clamp(20px, 2.6vw, 34px);
  font-weight: 800;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: 8px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 8px;
}

.hero-lead {
  margin: 26px 0 0;
  font-size: clamp(14px, 1.15vw, 16.5px);
  line-height: 1.7;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.78);
  max-width: 430px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.95);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}

.hero-btn {
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 14px 28px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

.hero-btn-primary {
  background: #ff0055;
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(255, 0, 85, 0.45);

  &:hover {
    background: #ff2b74;
    box-shadow: 0 12px 32px rgba(255, 0, 85, 0.62);
  }
}

.hero-btn-ghost {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255, 255, 255, 0.16);
  }
}
</style>
