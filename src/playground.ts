import { RotaCloud } from './rotacloud';

const rc = new RotaCloud({
  baseUri: 'https://api.rotacloud-staging.com/v1',
  apiKey: 'R1oVx92Qtb2LEV1LdrGQczkdlOqcue5SGQXw6KS7e4f5ZZd6Z3tn8L90GyMiHbog',
});

// rc.users.listAll({}).then((res) => console.log(res));

// rc.terminals.create({ name: 'RW Test Terminal', timezone: 1 }).then(
//   (res) => console.log(res),
//   (err) => console.log(err)
// );

// rc.terminals.get(69499, { rawResponse: true }).then((res) => console.log(res));
// rc.terminals.update(69499, { name: 'RW Test Terminal Updated' }).then((res) => console.log(res));

// rc.terminals.create({ name: 'RW Terminal', timezone: 1 }).then(
//   (res) => console.log(res),
//   (err) => console.log(err)
// );

// rc.terminals.listAll().then((res) => console.log(res));
// rc.terminalsActive.launchTerminal({ terminal: 70009, device: 'RW' }).then((res) => console.log(res));
// rc.terminalsActive.pingTerminal(70009, { action: 'ping', device: 'RW' }).then((res) => console.log(res));
// rc.usersClockInService.clockIn({ method: 'terminal', terminal: 70009, user: 1361665 }).then((res) => console.log(res));
