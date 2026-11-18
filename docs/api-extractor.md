# API Extractor

API Extractor combines the SDK's TypeScript declarations into `dist/main.d.ts` during the build.
It includes types referenced by the SDK's public exports, including their dependencies from the private `@rotacloud/types` package.
It does not copy every type from that package.

SDK consumers receive the combined declaration file when they install the SDK.
They do not need access to the private types package. These declarations contain no runtime code.
Developers who build the SDK from source still need access to its private build dependency.

API Extractor does not decide which endpoints are public.
Any internal type referenced by an SDK export can appear in the output.
Run `npm run check:types` and `npm run check:package` to check the declarations and package contents.

## Configuration

Keep `api-extractor.json` as strict JSON without comments. Its settings are:

- `$schema`: provides editor validation and suggestions.
- `mainEntryPointFilePath`: starts from the SDK declarations in `.build/types/main.d.ts`.
- `bundledPackages`: includes referenced types from `@rotacloud/types` and their dependencies instead of preserving imports to the private package.
- `compiler.tsconfigFilePath`: uses `tsconfig.build.json` to resolve types and imports.
- `apiReport.enabled`: disables the separate public API text report.
- `docModel.enabled`: disables the JSON model used by documentation tools.
- `dtsRollup.enabled`: combines the required declarations into one file.
- `dtsRollup.untrimmedFilePath`: writes `dist/main.d.ts` without filtering by release tags such as `@beta`.
- `tsdocMetadata.enabled`: disables generation of `tsdoc-metadata.json`.
- `messages.extractorMessageReporting`: suppresses warnings about missing release tags and referenced types that are not named exports.
- `messages.tsdocMessageReporting`: suppresses the listed warnings about braces and inline tags in existing documentation comments.
