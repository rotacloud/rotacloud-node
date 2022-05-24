# RotaCloud Node SDK

## Configuration

Configuration is simple, just import the core rotacloud.js SDK and supply your API key as necessary.

```typescript
import { RotaCloud } from 'rotacloud';

const rc = new RotaCloud({
  apiKey: 'YOUR_API_KEY',
});
```

## Auto paging

Our SDK support auto pagination as a way for developers to quickly consume list based endpoints. You will find a `list()` method on most services within the SDK which can be consumed using `for await of`. **Please ensure you are catching errors in your implementation.**

```typescript
try {
  for await (const user of rc.users.list()) {
    console.log(user);
  }
} catch (e) {
  console.log(e);
}
```
