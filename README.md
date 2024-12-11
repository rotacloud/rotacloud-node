# RotaCloud Node SDK

## Getting started

To use this SDK you'll need to `npm install rotacloud`. This will ensure you're ready
to start working with the SDK in your project.

## Contributing

Please ensure you perform the `npm run version:bump` command before commiting and
pushing your changes to the remote branch.

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
  for await (const user of client.user.list({})) {
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
