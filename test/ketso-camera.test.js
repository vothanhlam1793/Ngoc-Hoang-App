const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('Kết sổ charges 50,000 for every camera after the first', () => {
  const component = fs.readFileSync(
    path.join(__dirname, '..', 'components', 'KetSo', 'ECamera.vue'),
    'utf8'
  );

  assert.match(component, /const quantity = parseInt\(data\.data\.createOrUpdateCamera\.value\) \|\| 0;/);
  assert.match(component, /that\.camera = Math\.max\(0, quantity - 1\) \* 50000;/);
  assert.doesNotMatch(component, /createOrUpdateCamera\.value\) \* 0;/);
});
