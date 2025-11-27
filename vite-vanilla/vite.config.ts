import { defineConfig } from "vite";
import inspect from 'vite-plugin-inspect';
import * as glob from 'glob';
import path from 'path';

import comptimePlugin from '../custom-vite-plugins/vite-plugin-comptime.js';
import diagramPlugin from '../custom-vite-plugins/vite-plugin-diagram.js';
import vanillaSSGPlugin from '../custom-vite-plugins/vite-plugin-vanilla-ssg.js';
import babelPipesPlugin from '../custom-vite-plugins/vite-plugin-babel-pipes-in-dev.js';
import codePreviewPlugin from '../custom-vite-plugins/vite-plugin-code-preview.js';
import cronTabPlugin from '../custom-vite-plugins/vite-plugin-crons.ts';

export default defineConfig({
  server: {
    port: 4422,
  },
  build: {
    rollupOptions: {
      input: [
        'index.html',
        ...glob.sync(path.resolve("posts", "*.html"))
      ],
    }
  },
  plugins: [
    inspect(),
    // @ts-ignore
    babelPipesPlugin(),
    comptimePlugin(),
    // @ts-ignore
    codePreviewPlugin(),
    diagramPlugin(),
    vanillaSSGPlugin(),
    cronTabPlugin(),
  ],
  resolve: {
    alias: {
    }
  }
});

