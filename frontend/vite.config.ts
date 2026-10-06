import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * GitHub Pages chạy ứng dụng dưới /<repo>/, còn local dev chạy tại /.
 * Workflow truyền VITE_BASE=/Bandoso/ khi build trên GitHub Actions.
 */
const rawBase = process.env.VITE_BASE?.trim() || '/'
const base = rawBase === '/' ? '/' : `/${rawBase.replace(/^\/+|\/+$/g, '')}/`

export default defineConfig({
  base,
  plugins: [react()],
})
