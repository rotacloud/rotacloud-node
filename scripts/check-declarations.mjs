import { readFileSync } from 'node:fs';

const declarations = readFileSync(new URL('../dist/main.d.ts', import.meta.url), 'utf8');

if (declarations.includes('@rotacloud/types')) {
  console.error('dist/main.d.ts still references @rotacloud/types.');
  process.exitCode = 1;
}
