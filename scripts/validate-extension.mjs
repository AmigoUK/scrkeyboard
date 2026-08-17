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
await assertFileExists(resolve(distDir, '_locales/en/messages.json'));
await assertFileExists(resolve(distDir, '_locales/pl/messages.json'));

console.log('Extension build validation passed.');

