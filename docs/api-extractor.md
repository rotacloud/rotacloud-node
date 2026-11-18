# API Extractor

In order to not advertise all our private endpoint structures by exposing? API Extractor bundles only the types that the SDK's public exports need from `@rotacloud/types`.
API Extractor combines the SDK's TypeScript declarations into `dist/main.d.ts` during the build.

SDK consumers receive the combined declaration file when they install the SDK.
SDK consumers can use these types without installing `@rotacloud/types`.
Developers who build the SDK from source still need access to its private build dependency.

After the build, run `npm run check:types` to check that the declarations have no reference to `@rotacloud/types`.

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
