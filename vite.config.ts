import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  define: {
    __DEBUG__: JSON.stringify(!!process.env.VITE_DEBUG),
  },
  server: {
    allowedHosts: [".ngrok-free.dev"],
  },
})
