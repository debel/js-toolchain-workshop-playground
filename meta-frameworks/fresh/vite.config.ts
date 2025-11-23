import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";
import diagram from "../../custom-vite-plugins/vite-plugin-diagram.js";
import codePreview from "../../custom-vite-plugins/vite-plugin-code-preview.js";

export default defineConfig({
  plugins: [
    fresh(),
    diagram(),
    tailwindcss(),
    // @ts-ignore:
    codePreview({ output: "jsx" }),
  ],
  server: {
    port: 7113,
  },
});
