/**
 * Test type bundling with a fake private package and the exact version of the real package.
 * Check that required types work without the private package and unused types are excluded.
 * Create small test projects in the system temporary folder and run the SDK bundling helper there.
 * Keep them outside the repository so they cannot use its installed packages by accident.
 * Delete the test projects when the checks finish.
 */
import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { bundleDeclarations } from './build-declarations.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const temporary = mkdtempSync(join(tmpdir(), 'rotacloud-types-'));
const fixtureRoot = join(root, 'test-fixtures/types');
/** Collect strict consumer diagnostics without emitting files or using ambient package types. */
const compile = (folder, file, options = {}) => {
  const program = ts.createProgram([join(folder, file)], {
    strict: true,
    skipLibCheck: false,
    noEmit: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    types: [],
    ...options,
  });
  return ts.getPreEmitDiagnostics(program);
};
/** Fail with readable TypeScript diagnostics if a consumer fixture does not compile. */
const assertNoErrors = (diagnostics) =>
  assert.equal(
    diagnostics.length,
    0,
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: () => temporary,
      getCanonicalFileName: (name) => name,
      getNewLine: () => '\n',
    }),
  );

try {
  for (const fixture of ['synthetic', 'real']) {
    const project = join(temporary, fixture);
    const privatePackage = join(project, 'node_modules/@rotacloud/types');
    mkdirSync(privatePackage, { recursive: true });
    writeFileSync(
      join(project, 'package.json'),
      JSON.stringify({
        name: 'fixture-sdk',
        version: '1.0.0',
        type: 'module',
        types: './dist/main.d.ts',
        exports: { '.': './dist/main.d.ts' },
      }),
    );
    // The synthetic package controls inclusion tests; the real package checks the pinned published contract.
    if (fixture === 'synthetic') {
      writeFileSync(
        join(privatePackage, 'package.json'),
        JSON.stringify({ name: '@rotacloud/types', version: '0.0.0', types: './index.d.ts' }),
      );
      cpSync(join(fixtureRoot, 'private.d.ts'), join(privatePackage, 'index.d.ts'));
    } else {
      cpSync(join(root, 'node_modules/@rotacloud/types'), privatePackage, { recursive: true });
      const installed = JSON.parse(readFileSync(join(privatePackage, 'package.json'), 'utf8'));
      const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
      assert.equal(installed.version, manifest.devDependencies['@rotacloud/types']);
    }
    cpSync(join(fixtureRoot, `${fixture}.ts`), join(project, 'main.ts'));
    writeFileSync(
      join(project, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          strict: true,
          skipLibCheck: false,
          declaration: true,
          emitDeclarationOnly: true,
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          target: 'ES2022',
          types: [],
          outDir: './intermediate',
        },
        files: ['./main.ts'],
      }),
    );
    execFileSync(process.execPath, [
      join(root, 'node_modules/typescript/bin/tsc'),
      '-p',
      join(project, 'tsconfig.json'),
    ]);
    const output = join(project, 'dist/main.d.ts');
    /** Run the production declaration bundler against this isolated fixture. */
    const bundle = () =>
      bundleDeclarations({
        projectFolder: project,
        entryPoint: join(project, 'intermediate/main.d.ts'),
        outputFile: output,
        tsconfigFile: join(project, 'tsconfig.json'),
      });
    await bundle();
    const declaration = readFileSync(output, 'utf8');
    assert(!declaration.includes('@rotacloud/types'), `${fixture}: private import remains`);
    if (fixture === 'synthetic') {
      for (const name of ['SdkEndpointResponse', 'EndpointResponseDetails'])
        assert(declaration.includes(name), `Missing ${name}`);
      assert(!declaration.includes('UnusedEndpointResponse'), 'Unrelated declaration remains');
      // Adding an unrelated private declaration must leave the public bundle unchanged.
      writeFileSync(
        join(privatePackage, 'index.d.ts'),
        `${readFileSync(join(privatePackage, 'index.d.ts'), 'utf8')}\nexport interface AddedUnusedEndpointResponse { hidden: boolean; }\n`,
      );
      await bundle();
      assert.equal(readFileSync(output, 'utf8'), declaration, 'Unrelated declaration changed the bundle');
    } else {
      assert(declaration.includes('GetV2ShiftData'), 'Real contract is missing');
      assert(!declaration.includes('GetV2ShiftsData'), 'Unrelated real contract remains');
    }
    // A missing private export must fail compilation rather than produce an invalid declaration.
    writeFileSync(
      join(project, 'main.ts'),
      "import type { MissingContract } from '@rotacloud/types';\nexport type Broken = MissingContract;\n",
    );
    const invalid = compile(project, 'main.ts');
    assert(
      invalid.some((diagnostic) => diagnostic.code === 2305),
      'Missing private export did not fail',
    );
    assert.throws(
      () =>
        execFileSync(
          process.execPath,
          [join(root, 'node_modules/typescript/bin/tsc'), '-p', join(project, 'tsconfig.json'), '--noEmitOnError'],
          { stdio: 'pipe' },
        ),
      'Invalid declaration build succeeded',
    );
    // Remove the private dependency before checking that consumers can use the bundled declarations.
    rmSync(join(project, 'node_modules'), { recursive: true, force: true });
    const selected =
      fixture === 'synthetic' ? "{ nested: { value: 'visible' } }" : "{ path: { id: 1 }, url: '/v2/shifts/{id}' }";
    writeFileSync(
      join(project, 'consumer.ts'),
      `import type { PublicContract } from 'fixture-sdk';\nexport const contract: PublicContract = { selected: ${selected} };\n`,
    );
    assertNoErrors(compile(project, 'consumer.ts'));
    // Unrelated types must remain unavailable from both the public root and blocked package subpaths.
    for (const path of ['fixture-sdk', 'fixture-sdk/private']) {
      writeFileSync(
        join(project, 'negative.ts'),
        `import type { UnusedEndpointResponse } from '${path}';\nexport type Hidden = UnusedEndpointResponse;\n`,
      );
      const diagnostics = compile(project, 'negative.ts');
      assert.equal(diagnostics.length, 1, 'Expected one private import error');
      assert.equal(diagnostics[0].code, path === 'fixture-sdk' ? 2305 : 2307, 'Unexpected private import error');
    }
  }
  console.log('Synthetic and real declaration checks passed.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
