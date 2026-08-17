import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        serviceWorker: resolve(rootDir, 'src/background/serviceWorker.ts'),
        popup: resolve(rootDir, 'src/popup/popup.html'),
        options: resolve(rootDir, 'src/options/options.html')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});
