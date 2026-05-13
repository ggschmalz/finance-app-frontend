import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Garante que o servidor escute conexões da rede local
    allowedHosts: [
      '192.168.0.104.nip.io' // Libera explicitamente o nosso domínio do nip.io
    ]
  }
})
