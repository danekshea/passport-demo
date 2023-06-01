import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import process from 'process'
import { builtinModules } from 'module'

export default defineConfig({
  server: {
	port: 8080
  },
  plugins: [sveltekit()],
})

