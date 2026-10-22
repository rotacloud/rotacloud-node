# RotaCloud Node SDK

## Getting started

To use this SDK you'll need to `npm install rotacloud`. This will ensure you're ready
to start working with the SDK in your project.

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

## Configuration

Configuration is simple, import the `createRotaCloudClient` function from the SDK
and supply your API key:

```typescript
import { createRotaCloudClient } from 'rotacloud';

const client = createRotaCloudClient({
  apiKey: 'YOUR_API_KEY',
});
```

## Auto paging

Our SDK supports auto pagination as a way for developers to quickly consume list based endpoints.
You will find a `list()` method on most services within the SDK which can be consumed using
`for await of`. **Please ensure you are catching errors in your implementation.**

```typescript
const client = createRotaCloudClient({...})

try {
  for await (const user of client.user.list()) {
    console.log(user);
  }
} catch (e) {
  console.log(e);
}
```

## Retry Policies

Our SDK supports both basic and customisable retry polices.
Both can be easily configured in the SDKConfig object at time of instantiation.
Both exponential and static value based back offs are supported.

Only idempotent requests will be retried.

```typescript
import { createRotaCloudClient } from 'rotacloud';

const client = createRotaCloudClient({
  apiKey: 'YOUR_API_KEY',
  retry: 'expo' | 'static',
});
```

If more granular control is required of the internal retry policy values, an object
of retry configuration can be passed through to the `retry` field instead.

```typescript
import { createRotaCloudClient } from 'rotacloud';

const client = createRotaCloudClient({
  apiKey: 'YOUR_API_KEY',
  retry: { delay: 2000, exponential: false, maxRetries: 10 },
});
```
