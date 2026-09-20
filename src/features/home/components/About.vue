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

      <!-- Under 3D Character: Interactive Fighter Boxes -->
      <div class="fighter-select-dock">
        <div class="dock-header">
          <span class="dock-label">SELECT FIGHTER</span>
          <span v-if="isFighterLoading" class="dock-loading">LOADING 3D...</span>
        </div>

        <div class="dock-boxes">
          <div
            v-for="fighter in fighters"
            :key="fighter.id"
            class="fighter-box"
            :class="{ 'fighter-box-active': activeFighterId === fighter.id }"
            @click.stop="selectFighter(fighter.id)"
            :title="`Select ${fighter.name} (${fighter.subname})`"
          >
            <!-- P1 Badge -->
            <div class="p1-badge" v-if="activeFighterId === fighter.id">P1</div>

            <!-- Portrait Frame -->
            <div class="box-portrait-frame">
              <img :src="fighter.avatarPreview" :alt="fighter.subname" class="box-portrait-img" />
            </div>

            <!-- Name Tag -->
            <div class="box-label">
              <span class="box-fighter-title">{{ fighter.subname }}</span>
            </div>
          </div>
        </div>
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
  bottom: clamp(20px, 4vh, 40px);
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
  z-index: 25;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  user-select: none;

  @include mixins.landscape {
    left: clamp(52%, 60vw, 68%);
    transform: translateX(-50%);
  }
}

.dock-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dock-label {
  font-family: "Urbanist", sans-serif;
  font-size: 11px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
}

.dock-loading {
  font-family: "Urbanist", sans-serif;
  font-size: 10px;
  font-weight: 800;
  color: #ff0055;
  letter-spacing: 1px;
  animation: pulse-loading 0.8s infinite alternate;
}

@keyframes pulse-loading {
  from { opacity: 0.4; }
  to { opacity: 1; }
}

.dock-boxes {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* Individual Fighter Box */
.fighter-box {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px;
  background: rgba(12, 14, 20, 0.85);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  cursor: pointer;
  pointer-events: auto;
  transform: skewX(-6deg);
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.7);

  &:hover {
    border-color: rgba(255, 0, 85, 0.6);
    transform: skewX(-6deg) scale(1.05) translateY(-3px);
    box-shadow: 
      0 12px 25px rgba(0, 0, 0, 0.9),
      0 0 15px rgba(255, 0, 85, 0.3);
  }

  &-active {
    border-color: #ff0055;
    background: rgba(30, 8, 16, 0.9);
    box-shadow: 
      0 12px 25px rgba(0, 0, 0, 0.9),
      0 0 20px rgba(255, 0, 85, 0.6),
      inset 0 0 10px rgba(255, 0, 85, 0.25);
    transform: skewX(-6deg) scale(1.02);
  }
}

/* P1 Red Badge */
.p1-badge {
  position: absolute;
  top: -10px;
  left: 6px;
  background: #ff0055;
  color: #ffffff;
  font-family: "Urbanist", sans-serif;
  font-size: 10px;
  font-weight: 900;
  font-style: italic;
  padding: 1px 6px;
  border-radius: 1px;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(255, 0, 85, 0.6);
  z-index: 2;
  transform: skewX(6deg);
}

/* Portrait Image Frame */
.box-portrait-frame {
  width: clamp(64px, 6.5vw, 84px);
  height: clamp(64px, 6.5vw, 84px);
  border-radius: 2px;
  overflow: hidden;
  background: #000000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.box-portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.2s ease;
  transform: skewX(6deg) scale(1.05);

  .fighter-box:hover & {
    transform: skewX(6deg) scale(1.12);
  }
}

/* Label below image */
.box-label {
  padding-top: 4px;
  padding-bottom: 2px;
  text-align: center;
  transform: skewX(6deg);
}

.box-fighter-title {
  font-family: "Urbanist", sans-serif;
  font-size: 11px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 1px;
  color: #ffffff;
  text-transform: uppercase;
  display: block;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9);
}
</style>
