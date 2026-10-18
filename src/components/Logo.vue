<template>
  <div class="logo">
    <svg class="logo-mark" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient :id="gradId" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#4ad9ff" />
        </linearGradient>
      </defs>

      <!-- Letter D with a water line, matching the favicon -->
      <path
        d="M8 9 h9 a13 13 0 0 1 0 26 h-9 z M14 14.5 v15 h3 a7.5 7.5 0 0 0 0-15 z"
        :fill="`url(#${gradId})`"
        fill-rule="evenodd"
      />
      <rect x="5" y="36" width="18" height="2" rx="1" fill="#4ad9ff" opacity="0.85" />

      <!-- Bubbles -->
      <circle cx="33" cy="29" r="3.2" fill="none" stroke="#4ad9ff" stroke-width="1.6" opacity="0.8" />
      <circle cx="37" cy="20" r="2" fill="none" stroke="#7ce8ff" stroke-width="1.4" opacity="0.65" />
      <circle cx="32" cy="13" r="1.3" fill="#4ad9ff" opacity="0.6" />
    </svg>

    <span class="logo-word">DUTA</span>
  </div>
</template>

<script setup lang="ts">
/**
 * A gradient id has to be unique per instance, otherwise a second <Logo> on the
 * page would reference the first one's gradient.
 */
const gradId = `logo-grad-${Math.random().toString(36).slice(2, 8)}`;
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  gap: 9px;
  user-select: none;
}

.logo-mark {
  width: 30px;
  height: 30px;
  flex-shrink: 0;

  @include mixins.mq("md") {
    width: 34px;
    height: 34px;
  }
}

.logo-word {
  font-family: "Urbanist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 2.4px;
  line-height: 1;
  color: #ffffff;
  text-shadow:
    0 2px 12px rgba(0, 0, 0, 0.55),
    0 0 24px rgba(74, 217, 255, 0.35);

  @include mixins.mq("md") {
    font-size: 30px;
  }
}
</style>
