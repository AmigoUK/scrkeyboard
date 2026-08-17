import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const distDir = resolve('dist');
const requiredManifestVersion = 3;

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function assertFileExists(path) {
  await access(path);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const packageJson = await readJson(resolve('package.json'));
const manifest = await readJson(resolve(distDir, 'manifest.json'));

assert(
  manifest.manifest_version === requiredManifestVersion,
  `Expected manifest_version ${requiredManifestVersion}.`
);
assert(manifest.version === packageJson.version, 'manifest.json and package.json versions must match.');
assert(manifest.default_locale === 'en', 'Default locale must be English.');
assert(Array.isArray(manifest.permissions), 'manifest.json permissions must be an array.');
assert(manifest.permissions.includes('storage'), 'The storage permission is required.');
assert(manifest.permissions.includes('activeTab'), 'The activeTab permission is required.');
assert(manifest.permissions.includes('scripting'), 'The scripting permission is required.');
assert(
  Array.isArray(manifest.optional_host_permissions),
  'manifest.json optional_host_permissions must be an array.'
);

await assertFileExists(resolve(distDir, manifest.action.default_popup));
await assertFileExists(resolve(distDir, manifest.options_page));
await assertFileExists(resolve(distDir, manifest.background.service_worker));
await assertFileExists(resolve(distDir, 'assets/content.js'));
await assertFileExists(resolve(distDir, '_locales/en/messages.json'));
await assertFileExists(resolve(distDir, '_locales/pl/messages.json'));

assert(manifest.icons, 'manifest.json must declare icons.');
assert(manifest.action.default_icon, 'manifest.json must declare an action default_icon.');

for (const iconPath of Object.values(manifest.icons)) {
  await assertFileExists(resolve(distDir, iconPath));
}

for (const iconPath of Object.values(manifest.action.default_icon)) {
  await assertFileExists(resolve(distDir, iconPath));
}

const contentScript = await readFile(resolve(distDir, 'assets/content.js'), 'utf8');
assert(
  !/^\s*import\s/m.test(contentScript),
  'assets/content.js must be a bundled classic script without top-level import statements.'
);

console.log('Extension build validation passed.');
