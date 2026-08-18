import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    // The extension requires Chrome 116+, which supports modulepreload natively,
    // so Vite's polyfill is dead code. Dropping it also removes the only fetch()
    // call from the packaged extension.
    modulePreload: {
      polyfill: false
    },
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
