<script setup lang="ts">
import { fighter } from "../store/fighter";
</script>

<template>
  <div class="tekken-profile">
    <!-- Fighter Name Header -->
    <div class="fighter-header">
      <h1 class="fighter-name">{{ fighter.name }}</h1>
    </div>

    <!-- Stats Attributes Stack -->
    <div class="tekken-attributes">
      <div class="attr-item">
        <div class="attr-badge">Fighting Style</div>
        <div class="attr-value">{{ fighter.fightingStyle }}</div>
      </div>

      <div class="attr-item">
        <div class="attr-badge">Nationality</div>
        <div class="attr-value">{{ fighter.nationality }}</div>
      </div>

      <div class="attr-item">
        <div class="attr-badge">Height</div>
        <div class="attr-value">{{ fighter.height }}</div>
      </div>

      <div class="attr-item">
        <div class="attr-badge">Skill</div>
        <div class="skill-groups">
          <div v-for="group in fighter.skills" :key="group.label" class="skill-group">
            <span class="skill-group-label">{{ group.label }}</span>
            <span class="skill-group-items">{{ group.items.join(" · ") }}</span>
          </div>
        </div>
      </div>

      <div class="attr-item">
        <div class="attr-badge">Specialty</div>
        <div class="attr-value">{{ fighter.specialty }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tekken-profile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  user-select: none;
  pointer-events: auto;
  font-family: "Urbanist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  max-width: 440px;
}

/* Character Name */
.fighter-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  line-height: 0.9;
  margin-bottom: 8px;
}

.fighter-name {
  font-size: clamp(48px, 6vw, 76px);
  font-weight: 900;
  font-style: italic;
  text-transform: uppercase;
  color: #ffffff;
  letter-spacing: 1px;
  margin: 0;
  padding: 0;
  text-shadow: 
    0 2px 10px rgba(0, 0, 0, 0.9),
    0 0 30px rgba(255, 255, 255, 0.2);
}

.fighter-subname {
  font-size: clamp(16px, 2vw, 24px);
  font-weight: 800;
  font-style: italic;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  transition: color 0.2s ease;
}

/* Metallic Rank Badge */
.rank-container {
  margin-bottom: 20px;
}

.tekken-rank-plate {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 14px;
  background: linear-gradient(180deg, #ffffff 0%, #d8d8d8 30%, #8a8a8a 52%, #b5b5b5 70%, #f0f0f0 100%);
  border: 1.5px solid #ffffff;
  border-radius: 2px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.8),
    inset 0 1px 1px rgba(255, 255, 255, 0.9),
    inset 0 -1px 2px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 1px;
    border: 1px solid rgba(0, 0, 0, 0.4);
    border-radius: 1px;
    pointer-events: none;
  }
}

.rank-engraving {
  font-size: 15px;
  font-weight: 900;
  font-style: italic;
  color: #121212;
  letter-spacing: 0.5px;
  text-shadow: 
    0 1px 0 rgba(255, 255, 255, 0.8),
    0 -1px 0 rgba(0, 0, 0, 0.2);
  display: inline-block;
}

/* Attributes Stack (Tekken 8 Style) */
.tekken-attributes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attr-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
}

/* Solid Pink/Magenta Label */
.attr-badge {
  background: #ff0055;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 1px;
  letter-spacing: 0.6px;
  box-shadow: 0 2px 6px rgba(255, 0, 85, 0.4);
  line-height: 1.3;
}

/* Crisp White Value */
.attr-value {
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-shadow: 
    0 2px 6px rgba(0, 0, 0, 0.9),
    0 1px 2px rgba(0, 0, 0, 1);
  line-height: 1.25;

  @include mixins.mq("md") {
    font-size: 16px;
  }
}

/* Grouped skills: one compact line per category */
.skill-groups {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 1px;
}

.skill-group {
  display: flex;
  align-items: baseline;
  gap: 9px;
}

.skill-group-label {
  flex: 0 0 auto;
  min-width: 78px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.38);
}

.skill-group-items {
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.2px;
  text-shadow:
    0 2px 6px rgba(0, 0, 0, 0.9),
    0 1px 2px rgba(0, 0, 0, 1);
}
</style>
