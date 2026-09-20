<script setup lang="ts">
const props = defineProps<{
  isActive?: boolean;
  isDarkTheme?: boolean;
}>();
</script>

<template>
  <button
    class="header-link"
    data-cursor="circle-white"
    :class="{ 'header-link-active': props.isActive, 'header-link-dark': props.isDarkTheme }"
  >
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.header-link {
  position: relative;
  letter-spacing: 0.02em;
  font-weight: 700;
  border: none;
  background: none;
  transition: color 0.15s ease-in-out;
  font-size: var(--font-size-md);
  width: 128px;
  white-space: nowrap;
  text-transform: uppercase;
  z-index: 2;
  border-radius: 100px;
  padding: var(--space-xxs) 0;
  color: var(--color-text-400);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    transition: opacity 0.15s ease-in-out;
    background-color: #ff0055;
    box-shadow: 0 0 16px rgba(255, 0, 85, 0.7);
    border-radius: 100px;
    z-index: -1;
    opacity: 0;
  }

  &-dark {
    &::after {
      background-color: #ff0055;
      box-shadow: 0 0 16px rgba(255, 0, 85, 0.7);
    }
  }

  &-active {
    &::after {
      opacity: 0 !important;
    }
  }

  @include mixins.hover {
    &:hover {
      color: var(--color-white-400);

      &::after {
        opacity: 1;
      }
    }
  }

  &:focus-visible {
    outline: none;
    color: var(--color-white-400);

    &::after {
      opacity: 1;
    }
  }
}
</style>
