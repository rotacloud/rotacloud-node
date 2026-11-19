/**
 * Bundle the types needed by the SDK so consumers do not need the private types package.
 * The build and tests use this helper.
 */
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';

/**
 * Bundle declarations from one public entry point using the production configuration.
 *
 * @param {object} options - Paths for the declaration build.
 * @param {string} options.projectFolder - Project directory containing package.json.
 * @param {string} options.entryPoint - Intermediate declaration file that defines the public exports.
 * @param {string} options.outputFile - Destination for the combined declaration file.
 * @param {string} options.tsconfigFile - TypeScript configuration used to resolve declarations.
 * @returns {void}
 * @throws {Error} When API Extractor reports a failed declaration build.
 */
export function bundleDeclarations({ projectFolder, entryPoint, outputFile, tsconfigFile }) {
  const configObject = ExtractorConfig.loadFile(
    resolve(dirname(fileURLToPath(import.meta.url)), '../api-extractor.json'),
  );
  configObject.mainEntryPointFilePath = entryPoint;
  configObject.compiler.tsconfigFilePath = tsconfigFile;
  configObject.dtsRollup.untrimmedFilePath = outputFile;
  mkdirSync(dirname(outputFile), { recursive: true });
  const config = ExtractorConfig.prepare({
    configObject,
    configObjectFullPath: resolve(dirname(fileURLToPath(import.meta.url)), '../api-extractor.json'),
    packageJsonFullPath: resolve(projectFolder, 'package.json'),
    projectFolder,
  });
  const result = Extractor.invoke(config, { showVerboseMessages: false });
  if (!result.succeeded) {
    throw new Error(`Declaration build failed: ${result.errorCount} errors and ${result.warningCount} warnings.`);
  }
}
