<script setup lang="ts">
import Banner from "../../../components/Banner.vue";
</script>

<template>
  <div class="hero">
    <div class="hero-inner">
      <h1 class="hero-title">
        <span class="hero-title-line">Duta</span>
        <span class="hero-title-line">Alamin</span>
      </h1>

      <Banner class="hero-banner" copy="Software Engineer" size="sm" animated />
    </div>
  </div>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  width: 100%;
  min-height: calc(var(--lvh) * 100);
  display: flex;
  align-items: center;
  padding: 0 clamp(24px, 6vw, 90px);
}

.hero-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Badge hangs off the bottom-right of the name, tilted like a sticker. */
.hero-banner {
  display: block;
  margin-top: 6px;
  margin-left: clamp(120px, 22vw, 260px);
  transform: rotate(-2.5deg);
}

.hero-title {
  margin: 0;
  font-family: "Urbanist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  animation: hero-in 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

@keyframes hero-in {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.hero-title-line {
  display: block;
  font-size: clamp(60px, 9vw, 118px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -2px;
  color: #ffffff;
  text-shadow:
    0 6px 40px rgba(0, 0, 0, 0.65),
    0 0 80px rgba(74, 217, 255, 0.2);
}
</style>
