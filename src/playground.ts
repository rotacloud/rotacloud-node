import { RotaCloud } from './rotacloud';

const rc = new RotaCloud({
  baseUri: 'https://api.rotacloud-staging.com/v1',
  apiKey: 'R1oVx92Qtb2LEV1LdrGQczkdlOqcue5SGQXw6KS7e4f5ZZd6Z3tn8L90GyMiHbog',
});

// (async () => {
//   try {
//     const test = await rc.users.listAll({});
//     console.log(test);
//   } catch {
//     //
//   }
// })();

// (async () => {
//   for await (const t of rc.users.listByPage({})) {
//     console.log(t);
//   }
// })();

// rc.terminals.create({ name: 'RW Test Terminal', timezone: 1 }).then(
//   (res) => console.log(res),
//   (err) => console.log(err)
// );

// rc.terminals.get(69499, { rawResponse: true }).then((res) => console.log(res));
// rc.terminals.update(69499, { name: 'RW Test Terminal Updated' }).then((res) => console.log(res));

// (async () => {
//   try {
//     const test = await rc.terminals.listAll();
//     console.log(test);
//   } catch {
//     //
//   }
// })();

// rc.terminals.create({ name: 'RW Terminal', timezone: 1 }).then(
//   (res) => console.log(res),
//   (err) => console.log(err)
// );

// rc.terminals.listAll().then((res) => console.log(res));
// rc.terminalsActive.launchTerminal({ terminal: 70009, device: 'Test Device' }).then((res) => console.log(res));
rc.terminalsActive.pingTerminal(70009, { action: 'ping', device: 'Test Device' }).then((res) => console.log(res));
