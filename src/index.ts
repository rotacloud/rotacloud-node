import { RotaCloud } from './rotacloud';

const rc = new RotaCloud({
  baseUri: 'https://api.rotacloud-staging.com/v1',
  apiKey: 'R1oVx92Qtb2LEV1LdrGQczkdlOqcue5SGQXw6KS7e4f5ZZd6Z3tn8L90GyMiHbog',
});

rc.users.get(918261, { rawResponse: false }).then(
  (res) => console.log(res),
  (err) => console.log(err)
);
