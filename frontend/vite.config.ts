import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE:
//  - Chạy cục bộ (npm run dev)  : để trống  -> "/"
//  - GitHub Pages (project site): "/Bandoso/" (workflow tự truyền vào)
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
})
