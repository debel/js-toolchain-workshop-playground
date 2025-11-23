// @ts-check
import { defineConfig } from 'astro/config';
import diagramPlugin from '../../custom-vite-plugins/vite-plugin-diagram.js'
import codePreviewPlugin from '../../custom-vite-plugins/vite-plugin-code-preview.js'

// https://astro.build/config
export default defineConfig({
  vite: {
    // @ts-ignore
    plugins: [diagramPlugin(), codePreviewPlugin()]
  }
});
