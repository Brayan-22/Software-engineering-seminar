import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth-api": {
        target: "http://authbackbs.glud.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth-api/, "/api"),
      },
      "/course-api": {
        target: "https://coursefinderbs.glud.org",
        changeOrigin: true,
        secure: false, // 👈 evita que rechace el certificado autofirmado
        rewrite: (path) => path.replace(/^\/course-api/, "/api/v1"),
      },

    },
  },
})
