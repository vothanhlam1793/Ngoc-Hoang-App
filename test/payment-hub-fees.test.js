const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const compiler = require('vue-template-compiler');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'utils/paymentHubFees.js'), 'utf8');
const helpers = import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('fee query only sends active filters and keeps paging explicit', async () => {
  const { feeQuery } = await helpers;
  assert.equal(feeQuery({ type: 'TUITION', status: '', source: ' SYSTEM ', billingMonth: '2026-09', search: ' Bé An ' }, 2, 50),
    'page=2&pageSize=50&type=TUITION&source=SYSTEM&billingMonth=2026-09&search=B%C3%A9+An');
});

test('fee cancellation is restricted to active unattached records with a useful reason', async () => {
  const { feeCanCancel, feeCancelPayload } = await helpers;
  assert.equal(feeCanCancel({ status: 'ACTIVE' }), true);
  assert.equal(feeCanCancel({ status: 'ACTIVE', invoice: { id: 'invoice-1' } }), false);
  assert.equal(feeCanCancel({ status: 'ACTIVE', usageCount: 1 }), false);
  assert.equal(feeCanCancel({ status: 'ACTIVE', attachments: [{ id: 'link-1' }] }), false);
  assert.equal(feeCanCancel({ status: 'CANCELLED' }), false);
  assert.deepEqual(feeCancelPayload('  Nhập trùng khoản phí  '), { reason: 'Nhập trùng khoản phí' });
  assert.throws(() => feeCancelPayload('x'), /3 đến 500/);
});

test('fee responses normalize supported envelopes and derive summary usage', async () => {
  const { normalizeFeeResponse, feeUsage } = await helpers;
  const items = [{ status: 'ACTIVE' }, { status: 'ACTIVE', document: { code: 'PT-01' } }, { status: 'CANCELLED' }];
  const result = normalizeFeeResponse({ data: { rows: items, totalCount: 20 } });
  assert.equal(result.total, 20);
  assert.deepEqual(result.summary, { total: 20, active: 2, attached: 1, cancelled: 1 });
  assert.equal(feeUsage(items[1]).text, 'PT-01');
  assert.equal(feeUsage({ status: 'ACTIVE', attachments: [{ documentType: 'MONTHLY_SETTLEMENT', documentId: 'PKS-01' }] }).text,
    'Kết sổ tháng · PKS-01');
});

test('fee lookup page template and script compile', () => {
  const file = 'pages/khoanphi/index.vue';
  const sfc = compiler.parseComponent(fs.readFileSync(path.join(root, file), 'utf8'));
  const result = compiler.compile(sfc.template.content);
  assert.deepEqual(result.errors, [], file);
  new vm.Script(require('vue-template-es2015-compiler')(`function render() { ${result.render} }`));
  require('@babel/core').transformSync(sfc.script.content, { filename: `${file}.js`, configFile: false, babelrc: false });
});
