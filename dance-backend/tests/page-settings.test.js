/** @jest-environment node */
const { execFileSync } = require('child_process');
const path = require('path');

test('page settings API', () => {
  expect(() => execFileSync(process.execPath, [path.join(__dirname, '../node_modules/tsx/dist/cli.mjs'), '--test', path.join(__dirname, '../src/tests/pageSettings.check.ts')], { encoding: 'utf8' })).not.toThrow();
}, 30000);
