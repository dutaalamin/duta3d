import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import glsl from "vite-plugin-glsl";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [
    vue(),
    glsl({
      include: ["**/*.glsl", "**/*.vert", "**/*.frag"],
      defaultExtension: "glsl",
      warnDuplicatedImports: false,
    }),
  ],
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".ogg", ".wav", ".glsl", ".ktx2"],
  },
  assetsInclude: ["**/*.svg", "**/*.gltf", "**/*.glb", "**/*.png", "**/*.jpg", "**/*.ktx2", "**/*.fbx"],
  css: {
    preprocessorOptions: {
      scss: {
        // Sass 1.93 no longer resolves the old absolute "/src/..." form. It
        // failed silently, producing empty CSS: no colour variables, no fonts,
        // so every heading rendered black-on-black. `loadPaths` resolves the
        // styles folder once, and the bare `mixins` import keeps the default
        // `mixins.mq(...)` namespace working in every component style block.
        loadPaths: [fileURLToPath(new URL("./src/assets/styles", import.meta.url))],
        additionalData: `@use "mixins";`,
      },
    },
  },
  build: {
    outDir: "./dist",
    sourcemap: false,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        inlineDynamicImports: false,
        assetFileNames: "assets/[hash].[ext]",
        entryFileNames: "chunks/[name]-[hash].js",
        chunkFileNames: "chunks/[hash].js",
      },
    },
  },
});
