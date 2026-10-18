<template>
  <span class="logo-word">DUTA</span>
</template>

<style scoped lang="scss">
.logo-word {
  display: block;
  font-family: "Urbanist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 2.4px;
  line-height: 1;
  /* Ocean accent instead of plain white: the wordmark reads as part of the
     scene rather than a generic label. */
  color: var(--color-cyan-400);
  text-shadow:
    0 2px 12px rgba(0, 0, 0, 0.55),
    0 0 26px rgba(74, 217, 255, 0.45);
  user-select: none;

  @include mixins.mq("md") {
    font-size: 30px;
  }
}
</style>
