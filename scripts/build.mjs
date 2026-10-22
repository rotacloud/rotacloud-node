/**
 * Compile SDK JavaScript and intermediate declarations, then bundle the public declarations.
 * Run with --watch to rebuild after changes.
 * Failed builds remove release output so a later pack cannot publish stale files.
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

clearOutput();
rmSync(intermediateFolder, { recursive: true, force: true });
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
} else {
  try {
    const config = ts.readConfigFile(configFile, ts.sys.readFile);
    if (config.error) throw new Error(ts.formatDiagnosticsWithColorAndContext([config.error], formatHost));
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, projectFolder);
    const program = ts.createProgram(parsed.fileNames, parsed.options);
    const diagnostics = [...parsed.errors, ...ts.getPreEmitDiagnostics(program)];
    if (diagnostics.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, formatHost));
    const result = program.emit();
    if (result.emitSkipped || result.diagnostics.length) {
      throw new Error(ts.formatDiagnosticsWithColorAndContext(result.diagnostics, formatHost));
    }
    rollup();
  } catch (error) {
    clearOutput();
    console.error(error.message);
    process.exitCode = 1;
  }
}
