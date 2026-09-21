<template>
  <svg class="logo-svg" viewBox="0 0 300 90" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tekken-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="45%" stop-color="#e2e4ed" />
        <stop offset="100%" stop-color="#ff0055" />
      </linearGradient>
      <filter id="tekken-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="3" stdDeviation="2.5" flood-color="#ff0055" flood-opacity="0.75" />
      </filter>
    </defs>

    <!-- Japanese Kanji '鉄拳' (Tekken Iron Fist) Brush Aura in Crimson Red -->
    <g fill="#d31227" opacity="0.85">
      <!-- Kanji 鉄 (Iron) -->
      <path d="M25 15 L50 12 L48 20 L28 22 Z M15 28 L60 24 L58 32 L35 34 L45 55 L36 57 L28 38 L18 48 L12 40 Z M38 35 L62 58 L54 62 L32 40 Z" />
      <!-- Kanji 拳 (Fist) -->
      <path d="M190 12 L245 10 L242 18 L215 20 L235 32 L225 38 L208 22 L185 30 Z M175 42 L255 38 L250 48 L218 50 L228 65 L215 68 L206 52 L170 54 Z" />
    </g>

    <!-- TEKKEN Style DUTA Wordmark -->
    <g filter="url(#tekken-glow)">
      <!-- Letter D -->
      <path fill-rule="evenodd" d="M5 8 L64 8 L84 32 L84 48 L64 72 L18 72 L30 36 L12 36 L18 18 L5 8 Z M36 22 L56 22 L66 34 L66 44 L56 56 L30 56 Z" fill="url(#tekken-grad)" stroke="#0b0b0e" stroke-width="3" />

      <!-- Letter U -->
      <path fill-rule="evenodd" d="M78 8 L100 8 L90 52 L120 52 L130 8 L152 8 L138 72 L68 72 Z M98 22 L112 22 L104 56 L86 56 Z" fill="url(#tekken-grad)" stroke="#0b0b0e" stroke-width="3" />

      <!-- Letter T -->
      <path d="M120 4 L212 4 L224 18 L198 18 L184 72 L160 72 L174 18 L142 18 L134 26 L120 4 Z" fill="url(#tekken-grad)" stroke="#0b0b0e" stroke-width="3" />

      <!-- Letter A -->
      <path fill-rule="evenodd" d="M196 72 L224 8 L252 8 L286 72 L260 72 L252 52 L224 52 L216 72 Z M231 22 L244 22 L246 40 L225 40 Z M260 72 L296 80 L270 64 Z" fill="url(#tekken-grad)" stroke="#0b0b0e" stroke-width="3" />

      <!-- High-octane neon-pink blade slash -->
      <path d="M0 48 L300 48 L285 54 L0 54 Z" fill="#ff0055" opacity="0.9" />
    </g>
  </svg>
</template>

<style scoped lang="scss">
.logo-svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
