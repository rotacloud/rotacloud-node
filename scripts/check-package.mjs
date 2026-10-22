/**
 * Check the built npm archive and install it as an external consumer without private registry access.
 * Run after the SDK build. Check exports, archive contents, dependency boundaries, TypeScript imports, and ESM loading.
 * Temporary files and the isolated npm cache are removed when the check finishes.
 */
import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const temporary = mkdtempSync(join(tmpdir(), 'rotacloud-package-'));
/** Read package metadata or a lockfile as JSON. */
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
/** Run a check synchronously and stop on a nonzero exit code. */
const run = (command, args, options = {}) => execFileSync(command, args, { encoding: 'utf8', ...options });

try {
  // Compare exported names and type/value availability between source and bundled declarations.
  const configPath = join(root, 'tsconfig.json');
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  assert(!config.error, 'Cannot read the SDK compiler configuration');
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  const entries = [join(root, 'src/main.ts'), join(root, 'dist/main.d.ts')];
  const program = ts.createProgram(entries, { ...parsed.options, noEmit: true });
  const checker = program.getTypeChecker();
  /** List public symbols without treating a type-only export as a runtime value. */
  const exportsFor = (file) => {
    const source = program.getSourceFile(file);
    assert(source, `Missing public entry: ${file}`);
    const symbol = checker.getSymbolAtLocation(source);
    assert(symbol, `Missing public module: ${file}`);
    return checker
      .getExportsOfModule(symbol)
      .map((exported) => {
        const target = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
        return {
          name: exported.name,
          type: Boolean(target.flags & ts.SymbolFlags.Type),
          value: Boolean(target.flags & ts.SymbolFlags.Value),
        };
      })
      .sort((left, right) => left.name.localeCompare(right.name));
  };
  assert.deepEqual(
    exportsFor(entries[1]),
    exportsFor(entries[0]),
    'Public exports changed during declaration bundling',
  );
  // Disable lifecycle scripts here: prepack calls this check, so another prepack would recurse.
  const packed = JSON.parse(
    run(
      'npm',
      ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary, '--cache', join(temporary, 'pack-cache')],
      { cwd: root },
    ),
  )[0];
  const archive = join(temporary, packed.filename);
  const files = run('tar', ['-tzf', archive]).trim().split('\n');
  for (const file of files) {
    assert(file.startsWith('package/') && !file.split('/').includes('..'), `Invalid archive path: ${file}`);
    assert(
      /^package\/(?:package\.json|(?:README|LICENSE)(?:\.[^/]+)?|dist\/.+\.(?:js|d\.ts))$/i.test(file),
      `Unexpected archive file: ${file}`,
    );
    assert(!/\.(?:test|spec)\./.test(file), `Test file in archive: ${file}`);
    assert(
      !file.endsWith('.d.ts') || file === 'package/dist/main.d.ts',
      `Intermediate declaration in archive: ${file}`,
    );
  }
  run('tar', ['-xzf', archive, '-C', temporary]);
  const manifest = readJson(join(temporary, 'package/package.json'));
  // Development metadata may name the private package, but consumer dependencies must not require it.
  for (const dependency of ['@rotacloud/types', '@microsoft/api-extractor']) {
    assert(/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(manifest.devDependencies?.[dependency]), `Unpinned ${dependency}`);
  }
  for (const section of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
    assert(!manifest[section]?.['@rotacloud/types'], `Private package in ${section}`);
  }
  for (const section of ['bundledDependencies', 'bundleDependencies']) {
    assert(!manifest[section]?.includes?.('@rotacloud/types'), `Private package in ${section}`);
    assert(manifest[section] !== true, `Unrestricted ${section}`);
  }
  assert.equal(manifest.types, './dist/main.d.ts');
  assert.deepEqual(manifest.exports, {
    '.': { types: './dist/main.d.ts', import: './dist/main.js', default: './dist/main.js' },
  });
  for (const file of files.filter((name) => name.endsWith('.js') || name.endsWith('.d.ts'))) {
    assert(!readFileSync(join(temporary, file), 'utf8').includes('@rotacloud/types'), `Private reference in ${file}`);
  }
  const consumer = join(temporary, 'consumer');
  mkdirSync(consumer);
  const home = join(temporary, 'home');
  mkdirSync(home);
  const userConfig = join(temporary, 'npmrc');
  writeFileSync(userConfig, 'registry=https://registry.npmjs.org/\n');
  const globalConfig = join(temporary, 'global-npmrc');
  writeFileSync(globalConfig, '');
  // Supply a fresh npm configuration and cache without inheriting registry tokens from the shell.
  const environment = {
    PATH: process.env.PATH,
    HOME: home,
    SystemRoot: process.env.SystemRoot,
    npm_config_userconfig: userConfig,
    npm_config_globalconfig: globalConfig,
    npm_config_cache: join(temporary, 'cache'),
    npm_config_registry: 'https://registry.npmjs.org/',
  };
  writeFileSync(join(consumer, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  run('npm', ['install', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund', archive], {
    cwd: consumer,
    env: environment,
  });
  assert(!existsSync(join(consumer, 'node_modules/@rotacloud/types')), 'Private package installed');
  const lock = readJson(join(consumer, 'package-lock.json'));
  assert(
    !Object.keys(lock.packages).some((name) => name.endsWith('node_modules/@rotacloud/types')),
    'Private package in consumer dependency tree',
  );
  writeFileSync(
    join(consumer, 'consumer.ts'),
    `import { createRotaCloudClient } from 'rotacloud';\nimport type { SDKConfig, Shift, User } from 'rotacloud';\nconst config: SDKConfig = { apiKey: 'package-check' };\nconst client = createRotaCloudClient(config);\nconst shifts: Promise<Shift[]> = client.shift.listAll({ start: 0, end: 1 });\nconst users: Promise<User[]> = client.user.listAll({});\nvoid shifts; void users;\n`,
  );
  // Check both supported resolution modes against the installed archive, not workspace source.
  for (const mode of ['NodeNext', 'Bundler']) {
    run(
      process.execPath,
      [
        join(root, 'node_modules/typescript/bin/tsc'),
        '--strict',
        '--skipLibCheck',
        'false',
        '--noEmit',
        '--target',
        'ES2022',
        '--module',
        mode === 'Bundler' ? 'ESNext' : 'NodeNext',
        '--moduleResolution',
        mode,
        'consumer.ts',
      ],
      { cwd: consumer, env: environment },
    );
  }
  // Create the client without sending API requests. This checks that the runtime entry loads.
  run(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      "import { createRotaCloudClient } from 'rotacloud'; if (typeof createRotaCloudClient !== 'function') process.exit(1); createRotaCloudClient({ apiKey: 'package-check' });",
    ],
    { cwd: consumer, env: environment },
  );
  console.log('Archive and isolated consumer checks passed.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
