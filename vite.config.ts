import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      '192.168.0.104.nip.io',
      '192.168.0.17.nip.io', // Libera o novo domínio
      '191.244.237.62.nip.io',
      '172.20.10.2.nip.io',
      '172.20.10.2.nip.io',
      '10.100.6.61.nip.io',
      '192.168.0.102.nip.io',
      '192.168.0.2.nip.io'
    ]
  }
})
