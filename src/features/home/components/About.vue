<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { transitions } from "../../../animations";
import CharacterSheet from "./CharacterSheet.vue";

const contentSheetRef = ref<HTMLDivElement | null>(null);

const props = defineProps<{
  spacerRef: HTMLElement | null;
}>();

watchEffect((onInvalidate) => {
  if (props.spacerRef && contentSheetRef.value) {
    transitions.about.setup({
      about: props.spacerRef,
      contentSheet: contentSheetRef.value,
    });
  }

  onInvalidate(() => {
    transitions.about.destroy();
  });
});
</script>

<template>
  <div class="about-wrapper">
    <div ref="contentSheetRef" class="about-content">
      <!-- Left: Fighter Bio Sheet -->
      <div class="about-sheet-panel">
        <CharacterSheet />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(var(--lvh) * 100);
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
}

.about-content {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  display: flex;
  align-items: center;
  will-change: transform, opacity;
}

/* Left Fighter Bio Panel */
.about-sheet-panel {
  pointer-events: auto;
  padding-left: clamp(24px, 6vw, 90px);
  z-index: 15;
}
</style>
