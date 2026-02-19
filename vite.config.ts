import ComponentTagger from "vite-plugin-component-tagger";
import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
			ComponentTagger(),tailwindcss(), sveltekit()],
})
