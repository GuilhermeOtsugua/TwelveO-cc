import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repository = fileURLToPath(new URL('../../', import.meta.url));

async function fixture(t) {
    await mkdir(path.join(repository, '.tmp'), { recursive: true });
    const root = await mkdtemp(path.join(repository, '.tmp/export-test-'));
    t.after(() => rm(root, { recursive: true, force: true }));
    for (const directory of ['scripts', 'resources/static', 'public/build/assets', 'public/flags', 'public/files', 'public/licenses', 'dist']) {
        await mkdir(path.join(root, directory), { recursive: true });
    }
    await cp(path.join(repository, 'scripts/export-static.mjs'), path.join(root, 'scripts/export-static.mjs'));
    await writeFile(path.join(root, 'resources/static/home.html'), '<link href="__APP_CSS__"><script src="__APP_JS__"></script>');
    await writeFile(path.join(root, 'public/build/manifest.json'), JSON.stringify({
        css: { isEntry: true, file: 'assets/site.css' },
        js: { isEntry: true, file: 'assets/site.js' },
    }));
    await writeFile(path.join(root, 'public/build/assets/site.css'), 'body {}');
    await writeFile(path.join(root, 'public/build/assets/site.js'), 'console.log("site");');
    await writeFile(path.join(root, 'public/favicon.svg'), '<svg/>');
    await writeFile(path.join(root, 'dist/previous.txt'), 'Last successful export');
    return root;
}

function run(root, preload) {
    return spawnSync(process.execPath, [...(preload ? ['--import', pathToFileURL(preload).href] : []), path.join(root, 'scripts/export-static.mjs')], { encoding: 'utf8', timeout: 20000 });
}

async function assertPreviousExport(root) {
    assert.equal(await readFile(path.join(root, 'dist/previous.txt'), 'utf8'), 'Last successful export');
}

test('publishes a complete export, replaces the old output and removes staging files', async (t) => {
    const root = await fixture(t);
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(await readFile(path.join(root, 'dist/index.html'), 'utf8'), '<link href="/build/assets/site.css"><script src="/build/assets/site.js"></script>');
    assert.equal(await readFile(path.join(root, 'dist/favicon.svg'), 'utf8'), '<svg/>');
    assert.equal(await readFile(path.join(root, 'dist/build/assets/site.js'), 'utf8'), 'console.log("site");');
    await assert.rejects(readFile(path.join(root, 'dist/previous.txt')), { code: 'ENOENT' });
    assert.deepEqual(await readdir(path.join(root, '.tmp')), []);
});

for (const failure of ['invalid manifest', 'missing entry asset', 'missing asset directory']) {
    test(`preserves the previous export on ${failure}`, async (t) => {
        const root = await fixture(t);
        if (failure === 'invalid manifest') await writeFile(path.join(root, 'public/build/manifest.json'), '{');
        if (failure === 'missing entry asset') await rm(path.join(root, 'public/build/assets/site.js'));
        if (failure === 'missing asset directory') await rm(path.join(root, 'public/licenses'), { recursive: true });
        assert.notEqual(run(root).status, 0);
        await assertPreviousExport(root);
    });
}

for (const rollbackFails of [false, true]) {
    test(`publication failure ${rollbackFails ? 'retains the recovery copy if rollback fails' : 'restores the previous output'}`, async (t) => {
        const root = await fixture(t);
        const preload = path.join(root, 'fail-publish.mjs');
        await writeFile(preload, `
            import fs from 'node:fs/promises';
            import path from 'node:path';
            import { syncBuiltinESMExports } from 'node:module';
            const rename = fs.rename;
            fs.rename = async (from, to) => {
                if (path.basename(from) === 'next' || (${rollbackFails} && path.basename(from) === 'previous')) {
                    throw new Error('Simulated filesystem publication failure');
                }
                return rename(from, to);
            };
            syncBuiltinESMExports();
        `);
        const result = run(root, preload);
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /Simulated filesystem publication failure/);
        if (rollbackFails) {
            const stages = await readdir(path.join(root, '.tmp'));
            assert.equal(stages.length, 1);
            assert.equal(await readFile(path.join(root, '.tmp', stages[0], 'previous/previous.txt'), 'utf8'), 'Last successful export');
        } else {
            await assertPreviousExport(root);
            assert.deepEqual(await readdir(path.join(root, '.tmp')), []);
        }
    });
}
