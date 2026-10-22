# SDK development

Internal instructions for RotaCloud developers. This file is excluded from the npm package.

## Contributing

Please ensure you perform the `npm run version:bump` command before commiting and
pushing your changes to the remote branch.

## Local development

Use Node.js 20.9 or later to build the SDK. SDK consumers need Node.js 20 or later.

### Setup

The build uses private `@rotacloud/types` from GitHub Packages. Export a token with `read:packages` access as `GITHUB_PACKAGES_TOKEN`, then install dependencies:

```sh
npm ci
```

Keep the token outside the repository. SDK consumers do not need it.

CI uses the built-in `GITHUB_TOKEN`. This repository has Actions read access to the private @rotacloud/types package.

### Build and check

```sh
npm run build
npm run check:types
npm run check:package
```

The build uses API Extractor to bundle the required types into `dist/main.d.ts`.

- `check:types` checks that required types are included and unrelated types are excluded.
- `check:package` checks the npm archive and installs it without private registry access.

`npm pack` and `npm publish` run the build and checks automatically. The package excludes source files, tests, and build configuration.

### Watch and link

Start watch mode in the SDK repository:

```sh
npm run watch
```

You can also use `npm run build -- --watch`.

Link the SDK from the web app repository:

```sh
cd ../rotacloud-app
npm link ../rotacloud-node
npm ls rotacloud
npm run start
```

### Types

Legacy PHP API interfaces are defined in the SDK. Node endpoints shold be gradually migrated to use types from the @rotacloud/types package.
