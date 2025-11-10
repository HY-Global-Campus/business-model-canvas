import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.VITE_DEV_PORT || env.PORT || 5173)
  const host = env.VITE_DEV_HOST || '0.0.0.0'

  return {
    plugins: [react()],
    base: '/',
    assetsInclude: ['**/*.png', '**/*.svg'],
    server: {
      host,
      port,
      strictPort: true
    }
  }
})
