import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const distDir = resolve('dist');

async function copyFileToDist(sourcePath, destinationPath) {
  const targetPath = resolve(distDir, destinationPath);
  await mkdir(dirname(targetPath), { recursive: true });
  await cp(resolve(sourcePath), targetPath);
}

const manifest = JSON.parse(await readFile(resolve('manifest.json'), 'utf8'));
await mkdir(distDir, { recursive: true });
await writeFile(resolve(distDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
await cp(resolve('_locales'), resolve(distDir, '_locales'), { recursive: true });

for (const iconPath of Object.values(manifest.icons)) {
  await copyFileToDist(iconPath, iconPath);
}

await copyFileToDist('README.md', 'README.md');
await copyFileToDist('CHANGELOG.md', 'CHANGELOG.md');

