import { defineConfig } from 'vite';
import { cpSync } from 'node:fs';
export default defineConfig({
  base: './',
  build: { outDir: 'dist/board', emptyOutDir: true },
  plugins: [{ name: 'foundry-package', closeBundle() {
    for (const path of ['module.json', 'scripts', 'styles']) cpSync(path, `dist/${path}`, { recursive: true });
  } }]
});
