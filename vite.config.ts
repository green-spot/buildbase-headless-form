import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
        entry: 'src/main.ts',
        name: 'MySvelteApp',
        fileName: (format) => `fields.js`,
        formats: ["es"]
    },
    rollupOptions: {
      output: {
        assetFileNames: ({name}) => {return name === "style.css" ? "fields.css" : (name ?? "")}
      }
    }
  }
})
