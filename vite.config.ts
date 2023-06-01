import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 8080
  },
  plugins: [
    nodePolyfills({
      protocolImports: true
    }),
    sveltekit()
  ],
})
