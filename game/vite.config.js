import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works on GitHub Pages under /<repo>/
// fs.allow lets the dev server read the guide markdown files in the repo root.
export default defineConfig({ plugins: [react()], base: './', server: { fs: { allow: ['..'] } } })
