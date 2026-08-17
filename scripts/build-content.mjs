import { build } from 'esbuild';
import { resolve } from 'node:path';

await build({
  bundle: true,
  entryPoints: [resolve('src/content/content.ts')],
  format: 'iife',
  logLevel: 'info',
  outfile: resolve('dist/assets/content.js'),
  sourcemap: true,
  target: 'chrome116'
});

