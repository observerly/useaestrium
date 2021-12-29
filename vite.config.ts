/// <reference types="vitest" />

import {
  defineConfig
} from 'vite'

import vue from '@vitejs/plugin-vue'

import typescript from '@rollup/plugin-typescript'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    watch: false
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    }),
    vue()
  ]
})