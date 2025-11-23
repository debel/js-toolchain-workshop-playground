import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import codePreviewPlugin from '../../custom-vite-plugins/vite-plugin-code-preview.js'
import diagramPlugin from '../../custom-vite-plugins/vite-plugin-diagram.js'

export default defineConfig({
  server: {
    port: 5211,
  },
  plugins: [
    codePreviewPlugin({ output: 'jsx' }),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      srcDirectory: 'src',
    }),
    viteReact(),
    diagramPlugin(),
  ],
})
