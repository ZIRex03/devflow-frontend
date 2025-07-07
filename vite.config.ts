import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    alias:{
      '@': path.resolve(__dirname, './src'),
      '@pages' : path.resolve(__dirname, './src/pages'),
      '@components' : path.resolve(__dirname, './src/components'),
      '@styles' : path.resolve(__dirname, './src/styles'),
      '@images' : path.resolve(__dirname, './src/images'),
      '@icons' : path.resolve(__dirname, './src/images/icons'),
      '@features' : path.resolve(__dirname, './src/features'),
      '@slice' : path.resolve(__dirname, './src/features/slice'),
    }
  }
})
