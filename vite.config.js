import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  base: "./",
  publicDir: "img",
  plugins: [svelte()],
  build: {
    rollupOptions: { input: { main: "index.html", classic: "classic.html" } },
  },
});
