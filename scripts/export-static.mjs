import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(root, 'dist');
const publicDir = path.join(root, 'public');
const templatePath = path.join(root, 'resources', 'static', 'home.html');
const manifestPath = path.join(publicDir, 'build', 'manifest.json');

await mkdir(outputDir, { recursive: true });
await emptyDir(outputDir);

await copyPublicAsset('build');
await copyPublicAsset('flags');
await copyPublicFile('favicon.ico');
await copyPublicFile('favicon.svg');
await copyPublicFile('robots.txt');

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const appScriptEntry = findManifestEntry((entry) => entry.isEntry && entry.file?.endsWith('.js'));
const appStyleEntry = findManifestEntry((entry) => entry.isEntry && entry.file?.endsWith('.css'));

if (!appScriptEntry?.file || !appStyleEntry?.file) {
    throw new Error('Unable to find the Vite app assets in public/build/manifest.json.');
}

const html = (await readFile(templatePath, 'utf8'))
    .replaceAll('__APP_CSS__', `/build/${appStyleEntry.file}`)
    .replaceAll('__APP_JS__', `/build/${appScriptEntry.file}`);

await writeFile(path.join(outputDir, 'index.html'), html);

console.log(`Static site exported to ${outputDir}`);

async function copyPublicAsset(relativePath) {
    await cp(path.join(publicDir, relativePath), path.join(outputDir, relativePath), {
        recursive: true,
        force: true,
    });
}

async function copyPublicFile(relativePath) {
    try {
        await cp(path.join(publicDir, relativePath), path.join(outputDir, relativePath), {
            force: true,
        });
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
}

async function emptyDir(directory) {
    const entries = await readdir(directory);

    await Promise.all(entries.map((entry) => rm(path.join(directory, entry), {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 100,
    })));
}

function findManifestEntry(predicate) {
    return Object.values(manifest).find(predicate);
}
