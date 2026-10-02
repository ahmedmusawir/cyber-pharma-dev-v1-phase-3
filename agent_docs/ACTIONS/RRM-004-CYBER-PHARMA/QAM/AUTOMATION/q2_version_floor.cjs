'use strict';
// Numeric, stable three-component comparison used by the installed-metadata assertion.
const [value, floor] = process.argv.slice(2);
const parse = text => /^\d+\.\d+\.\d+$/.test(text || '') ? text.split('.').map(Number) : null;
const a = parse(value), b = parse(floor);
if (!a || !b || [...a,...b].some(n => !Number.isSafeInteger(n))) {
  console.log('invalid-version'); process.exitCode = 2;
} else {
  let order = 0;
  for (let i = 0; i < 3 && !order; i++) order = Math.sign(a[i] - b[i]);
  console.log('value=' + value + ' floor=' + floor + ' meets-floor=' + (order >= 0));
  process.exitCode = order >= 0 ? 0 : 1;
}
