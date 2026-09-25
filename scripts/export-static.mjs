import { access, cp, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(root, 'dist');
const publicDir = path.join(root, 'public');
const templatePath = path.join(root, 'resources', 'static', 'home.html');
const manifestPath = path.join(publicDir, 'build', 'manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const appScriptEntry = findManifestEntry((entry) => entry.isEntry && entry.file?.endsWith('.js'));
const appStyleEntry = findManifestEntry((entry) => entry.isEntry && entry.file?.endsWith('.css'));

if (!appScriptEntry?.file || !appStyleEntry?.file) {
    throw new Error('Unable to find the Vite app assets in public/build/manifest.json.');
}

await access(path.join(publicDir, 'build', appScriptEntry.file));
await access(path.join(publicDir, 'build', appStyleEntry.file));
const html = (await readFile(templatePath, 'utf8'))
    .replaceAll('__APP_CSS__', `/build/${appStyleEntry.file}`)
    .replaceAll('__APP_JS__', `/build/${appScriptEntry.file}`);

// Prepare the entire export before moving the last successful output.
const scratch = path.join(root, '.tmp');
await mkdir(scratch, { recursive: true });
const workspace = await mkdtemp(path.join(scratch, 'static-export-'));
const stagingDir = path.join(workspace, 'next');
const previousDir = path.join(workspace, 'previous');
let keepRecoveryCopy = false;

try {
    await mkdir(stagingDir);
    for (const directory of ['build', 'flags', 'files', 'licenses']) {
        await cp(path.join(publicDir, directory), path.join(stagingDir, directory), { recursive: true });
    }
    for (const file of ['apple-touch-icon.png', 'favicon.ico', 'favicon-32.png', 'favicon-192.png', 'favicon.svg', 'robots.txt']) {
        await copyPublicFile(file);
    }
    await writeFile(path.join(stagingDir, 'index.html'), html);

    let previousMoved = false;
    try {
        await rename(outputDir, previousDir);
        previousMoved = true;
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }

    try {
        await rename(stagingDir, outputDir);
    } catch (error) {
        if (previousMoved) {
            try {
                await rename(previousDir, outputDir);
            } catch (restoreError) {
                keepRecoveryCopy = true;
                throw new AggregateError([error, restoreError], `Export failed; previous output retained at ${previousDir}`);
            }
        }
        throw error;
    }
} finally {
    if (!keepRecoveryCopy) {
        await rm(workspace, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    }
}

console.log(`Static site exported to ${outputDir}`);

async function copyPublicFile(relativePath) {
    try {
        await cp(path.join(publicDir, relativePath), path.join(stagingDir, relativePath));
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }
}

function findManifestEntry(predicate) {
    return Object.values(manifest).find(predicate);
}
