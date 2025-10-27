import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // biar bisa diakses dari luar localhost
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "unadverse-darron-prelabial.ngrok-free.dev" // ✨ tambahkan domain ngrok kamu di sini
    ]
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: [
      "unadverse-darron-prelabial.ngrok-free.dev"
    ]
  }
})