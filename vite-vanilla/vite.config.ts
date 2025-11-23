import { defineConfig } from "vite";
import inspect from 'vite-plugin-inspect';
import * as glob from 'glob';
import path from 'path';

import comptimePlugin from '../custom-vite-plugins/vite-plugin-comptime.js';
import diagramPlugin from '../custom-vite-plugins/vite-plugin-diagram.js';
import vanillaSSGPlugin from '../custom-vite-plugins/vite-plugin-vanilla-ssg.js';
import babelPipesPlugin from '../custom-vite-plugins/vite-plugin-babel-pipes-in-dev.js';
import codePreviewPlugin from '../custom-vite-plugins/vite-plugin-code-preview.js';

export default defineConfig({
  server: {
    port: 4422,
  },
  build: {
    rollupOptions: {
      input: [
        'index.html', ...glob.sync(path.resolve(import.meta.url, "posts", "*.html"))],
    }
  },
  plugins: [
    inspect(),
    // @ts-ignore
    babelPipesPlugin(),
    comptimePlugin(),
    codePreviewPlugin(),
    diagramPlugin(),
    vanillaSSGPlugin(),
  ]
});

