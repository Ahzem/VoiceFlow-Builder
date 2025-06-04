import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow external access
    port: 5173,
    strictPort: false,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok.io',
      '.ngrok-free.app',
      '.ngrok.app'
    ]
  },
  // Optimize for development
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@vapi-ai/web']
  }
})
