/**
 * Combine the declarations from TypeScript into dist/main.d.ts.
 * Run with --clean to remove previous build output.
 * Run with --watch to compile and bundle after changes.
 */
import { rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { bundleDeclarations } from './build-declarations.mjs';

const projectFolder = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputFolder = resolve(projectFolder, 'dist');
const intermediateFolder = resolve(projectFolder, '.build');
const configFile = resolve(projectFolder, 'tsconfig.build.json');
const clean = process.argv.includes('--clean');
const watch = process.argv.includes('--watch');
const formatHost = {
  getCanonicalFileName: (file) => file,
  getCurrentDirectory: () => projectFolder,
  getNewLine: () => '\n',
};

/** Remove release files before a rebuild or after a failed build. */
function clearOutput() {
  rmSync(outputFolder, { recursive: true, force: true });
}

/** Bundle intermediate declarations into the public declaration file. */
function rollup() {
  bundleDeclarations({
    projectFolder,
    entryPoint: resolve(intermediateFolder, 'types/main.d.ts'),
    outputFile: resolve(outputFolder, 'main.d.ts'),
    tsconfigFile: configFile,
  });
}

if (clean || watch) {
  clearOutput();
  rmSync(intermediateFolder, { recursive: true, force: true });
}

if (watch) {
  const host = ts.createWatchCompilerHost(configFile, {}, ts.sys, ts.createEmitAndSemanticDiagnosticsBuilderProgram);
  // Emit the full program because each rebuild starts with an empty release directory.
  host.afterProgramCreate = (builder) => {
    clearOutput();
    const program = builder.getProgram();
    const diagnostics = ts.getPreEmitDiagnostics(program);
    if (diagnostics.length) {
      console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, formatHost));
      return;
    }
    const result = program.emit();
    if (result.emitSkipped || result.diagnostics.length) {
      console.error(ts.formatDiagnosticsWithColorAndContext(result.diagnostics, formatHost));
      return;
    }
    try {
      rollup();
      console.log('Build complete. Watching for file changes.');
    } catch (error) {
      clearOutput();
      console.error(error.message);
    }
  };
  ts.createWatchProgram(host);
} else if (!clean) {
  try {
    rollup();
  } catch (error) {
    clearOutput();
    console.error(error.message);
    process.exitCode = 1;
  }
}
