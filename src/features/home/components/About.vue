<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { transitions } from "../../../animations";
import CharacterSheet from "./CharacterSheet.vue";
import { activeFighterId, fighters, isFighterLoading } from "../store/characterSelect";
import { kenneyCharacter } from "../../../three/objects/kenney";

const contentSheetRef = ref<HTMLDivElement | null>(null);

const props = defineProps<{
  spacerRef: HTMLElement | null;
}>();

const selectFighter = (id: "architect" | "striker") => {
  kenneyCharacter.switchAboutFighter(id);
};

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
      <!-- Left: Tekken Fighter Bio Sheet -->
      <div class="about-sheet-panel">
        <CharacterSheet />
      </div>

      <!-- Under 3D Character: Interactive Fighter Selector -->
      <div class="fighter-select-dock">
        <span class="dock-label">Select Fighter</span>

        <div class="dock-boxes">
          <button
            v-for="fighter in fighters"
            :key="fighter.id"
            type="button"
            class="fighter-card"
            :class="{
              'fighter-card-active': activeFighterId === fighter.id,
              'fighter-card-blue': fighter.id === 'striker'
            }"
            @click.stop="selectFighter(fighter.id)"
            :title="`Select ${fighter.name} (${fighter.subname})`"
            :aria-label="`Select ${fighter.name} (${fighter.subname})`"
            :aria-pressed="activeFighterId === fighter.id"
          >
            <img :src="fighter.avatarPreview" :alt="fighter.subname" class="card-portrait-img" />
            <span class="card-fade"></span>
          </button>
        </div>

        <span v-if="isFighterLoading" class="dock-loading">Loading 3D...</span>
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
  margin-top: -20px;
  z-index: 15;
}

/* Fighter Select Dock Directly Under the 3D Character */
.fighter-select-dock {
  position: absolute;
  bottom: clamp(16px, 3.5vh, 34px);
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
  z-index: 25;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  user-select: none;
}

.dock-label {
  font-family: "Urbanist", sans-serif;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.25s ease;
}

.dock-loading {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  font-family: "Urbanist", sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
  animation: pulse-loading 0.9s infinite alternate;
}

@keyframes pulse-loading {
  from { opacity: 0.35; }
  to { opacity: 1; }
}

.dock-boxes {
  display: flex;
  align-items: flex-end;
  gap: 14px;
}

/* Minimal fighter portraits */
.fighter-card {
  position: relative;
  width: clamp(82px, 7.5vw, 104px);
  height: clamp(106px, 10vw, 132px);
  padding: 0;
  border: none;
  border-radius: 14px;
  overflow: hidden;
  background: transparent;
  cursor: pointer;
  pointer-events: auto;
  user-select: none;
  -webkit-appearance: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  isolation: isolate;
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);

  /* Ring: subtle when idle, colored when active */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 3;
    border-radius: inherit;
    border: 1.5px solid rgba(255, 255, 255, 0.14);
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.65);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    pointer-events: none;
  }

  &:focus-visible {
    outline: none;

    &::after {
      border-color: rgba(255, 255, 255, 0.7);
    }
  }

  &:hover {
    transform: translateY(-3px);

    &::after {
      border-color: rgba(255, 255, 255, 0.4);
    }
  }

  &-active {
    transform: translateY(-5px);

    &::after {
      border-color: #ff0055;
      box-shadow:
        0 16px 38px rgba(0, 0, 0, 0.7),
        0 0 22px rgba(255, 0, 85, 0.5);
    }
  }

  &-blue.fighter-card-active {
    &::after {
      border-color: #0077ff;
      box-shadow:
        0 16px 38px rgba(0, 0, 0, 0.7),
        0 0 22px rgba(0, 119, 255, 0.5);
    }
  }
}

.card-portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: saturate(0.55) brightness(0.62);
  transition: filter 0.35s ease, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);

  .fighter-card:hover & {
    filter: saturate(0.9) brightness(0.85);
    transform: scale(1.03);
  }

  .fighter-card-active & {
    filter: saturate(1.05) brightness(1);
    transform: scale(1.02);
  }
}

/* Soft bottom fade so the portrait blends into the scene */
.card-fade {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    transparent 45%,
    rgba(4, 5, 9, 0.55) 100%
  );
  opacity: 0.9;
  transition: opacity 0.35s ease;

  .fighter-card-active & {
    opacity: 0.45;
  }
}
</style>
