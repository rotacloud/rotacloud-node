import { createSdkClient } from './macros';
import { SDKConfig } from './rotacloud';
import { SERVICES } from './service';
// import { createClient } from "./macros" assert {type: "macro"}

export const RotaCloud = createSdkClient(SERVICES);

export const CONFIG_STAGING = {
  baseUri: 'https://api.rotacloud-staging.com/v1',
  apiKey: '5CQys9WKvGTB8qn3rI0qXBCH2paB4tiYpS57iWBDVmKhAkJ7WGFAOjtCFNM73Wlm',
  accountId: 374042,
} satisfies Partial<SDKConfig>;

(async () => {
  const client = RotaCloud(CONFIG_STAGING);
  console.log(await client.shifts.list());
  console.log(await client.leave.list());
})();
