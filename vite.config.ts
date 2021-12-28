import {
  defineConfig
} from 'vite'

import vue from '@vitejs/plugin-vue'

import typescript from '@rollup/plugin-typescript'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    }),
    vue()
  ]
})