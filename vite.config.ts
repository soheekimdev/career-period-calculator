import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    // 엑셀 파일에 대한 올바른 MIME 타입 설정
    headers: {
      'Cross-Origin-Embedder-Policy': 'cross-origin',
    },
  },
  // public 폴더 파일들의 MIME 타입 매핑
  assetsInclude: ['**/*.xlsx'],
})
