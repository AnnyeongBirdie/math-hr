import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/math-hr/', // 👈 this tells GitHub Pages where to find your app
  plugins: [react()],
});
