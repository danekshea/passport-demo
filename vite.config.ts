import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import process from 'process'
import { builtinModules } from 'module'

export default defineConfig({
  define: {
    'process.env': process.env,
    global: {},
  },
  plugins: [sveltekit()],
  build: {
    rollupOptions: {
      external: builtinModules,
    },
  },
  resolve: {
    alias: {
      process: 'process/browser',
      stream: 'stream-browserify',
      util: 'util/util.js',
      buffer: 'buffer/index.js',
    },
  },
})

