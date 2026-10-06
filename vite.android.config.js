import { defineConfig } from "vite";
import webConfig from "./vite.config.js";

export default defineConfig({
  ...webConfig,
  publicDir: false,
  build: {
    ...webConfig.build,
    target: "chrome106",
    cssTarget: "chrome106",
    outDir: "android/app/build/generated/assets/game",
    emptyOutDir: true,
    rollupOptions: { input: { main: "index.html" } },
  },
});
