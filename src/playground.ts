import { RotaCloud } from './rotacloud.js';

const rc = new RotaCloud({
  baseUri: 'https://api.rotacloud-staging.com/v1',
  apiKey: 'R1oVx92Qtb2LEV1LdrGQczkdlOqcue5SGQXw6KS7e4f5ZZd6Z3tn8L90GyMiHbog',
  retryPolicy: true,
  retryType: 'expo',
  maxRetries: 10,
});

rc.users.get(9182610, { rawResponse: false }).then(
  (res) => console.log(res),
  (err) => console.log(err)
);

// (async () => {
//   try {
//     const test = await rc.accounts.listAll();
//     console.log(test);
//   } catch {
//     //
//   }
// })();

// rc.accounts.listAll().then((res) => console.log(res));

// rc.accounts.listAll().then(
//   (res) => console.log(res),
//   (err) => console.log(err)
// );
