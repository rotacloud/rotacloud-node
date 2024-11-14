import { ServiceSpecification, createSdkClient } from './macros';
import { SDKConfig } from './rotacloud';
// import { createClient } from "./macros" assert {type: "macro"}

const services = {
  shifts: {
    endpoint: 'shifts',
    endpointVersion: 'v2',
    operations: ['get', 'list', 'delete'],
    customOperations: {
      /** Docs for custom operations just work */
      publish: () => async () => true,
      /** Overrides for existing operations also work */
      get: () => async () => true,
    },
  },
  timeZone: {
    endpoint: 'timezones',
    endpointVersion: 'v1',
    operations: ['get', 'list'],
  },
} satisfies Record<string, ServiceSpecification>;

export const RotaCloud = createSdkClient(services);

export const CONFIG_STAGING = {
  baseUri: 'https://api.rotacloud-staging.com/v1',
  apiKey: '5CQys9WKvGTB8qn3rI0qXBCH2paB4tiYpS57iWBDVmKhAkJ7WGFAOjtCFNM73Wlm',
  accountId: 374042,
} satisfies Partial<SDKConfig>;

(async () => {
  const client = RotaCloud(CONFIG_STAGING);
  console.log(await client.shifts.get());
  console.log(await client.timeZone.get());
})();
