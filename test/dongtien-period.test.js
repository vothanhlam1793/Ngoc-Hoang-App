const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const compiler = require('vue-template-compiler');

const source = fs.readFileSync(path.join(__dirname, '../pages/dongtien/index.vue'), 'utf8');

function setup() {
  const script = compiler.parseComponent(source).script.content
    .replace(/^import .*$/gm, '')
    .replace('export default', 'component =');
  const context = { gql: (strings, ...values) => strings.reduce((result, part, index) => result + part + (values[index] || ''), ''),
    paymentHubAdmin: () => true, InputCurrency: {}, DebtForm: {}, ParentEditModal: {} };
  vm.runInNewContext(script, context);
  const page = { ...context.component.data(), $bvToast: { toast() {} } };
  for (const [name, method] of Object.entries(context.component.methods)) page[name] = method.bind(page);
  return { page, component: context.component };
}

test('dong tien template compiles and exposes all financial periods', () => {
  const template = compiler.parseComponent(source).template.content;
  assert.deepEqual(compiler.compile(template).errors, []);
  for (const label of ['Tuần này', 'Tuần trước', 'Tháng này', 'Tháng trước', 'Tùy chỉnh']) assert.match(source, new RegExp(label));
  assert.match(source, /createdAt_gte/);
  assert.match(source, /settledAt_gte/);
});

test('dong tien defaults to Vietnam Monday week and handles month rollover', () => {
  const { page } = setup();
  assert.equal(page.period, 'this-week');
  assert.deepEqual({ ...page.periodRange('this-week', new Date('2026-09-28T03:00:00Z')) }, { from: '2026-09-28', to: '2026-10-04' });
  assert.deepEqual({ ...page.periodRange('last-week', new Date('2026-09-28T03:00:00Z')) }, { from: '2026-09-21', to: '2026-09-27' });
  assert.deepEqual({ ...page.periodRange('this-month', new Date('2026-02-15T03:00:00Z')) }, { from: '2026-02-01', to: '2026-02-28' });
  assert.deepEqual({ ...page.periodRange('last-month', new Date('2026-01-15T03:00:00Z')) }, { from: '2025-12-01', to: '2025-12-31' });
});

test('GraphQL variables filter cash and settlements by the selected Vietnam days', () => {
  const { page } = setup();
  page.range = { from: '2026-09-28', to: '2026-10-04' };
  assert.deepEqual(JSON.parse(JSON.stringify(page.dateVariables())), {
    cashWhere: { createdAt_gte: '2026-09-27T17:00:00.000Z', createdAt_lte: '2026-10-04T16:59:59.999Z' },
    settlementWhere: { settledAt_gte: '2026-09-27T17:00:00.000Z', settledAt_lte: '2026-10-04T16:59:59.999Z' }
  });
});

test('custom period rejects reversed dates without loading data', async () => {
  const { page } = setup();
  let fetched = false;
  page.fetchData = async () => { fetched = true; };
  page.customRange = { from: '2026-10-04', to: '2026-09-28' };
  await page.applyCustomRange();
  assert.equal(fetched, false);
  assert.equal(page.customRangeError, 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc');
});

test('opening and cancelling custom period does not change the applied period', async () => {
  const { page } = setup();
  page.period = 'this-week';
  page.range = { from: '2026-09-28', to: '2026-10-04' };
  await page.selectPeriod('custom');
  assert.equal(page.period, 'this-week');
  assert.equal(page.customPeriodOpen, true);
  page.customRange = { from: '2026-01-01', to: '2026-01-31' };
  page.cancelCustomRange();
  assert.equal(page.customPeriodOpen, false);
  assert.deepEqual({ ...page.customRange }, page.range);
});

test('applying custom period closes modal and reloads the selected range', async () => {
  const { page } = setup();
  let fetched = 0;
  page.fetchData = async () => { fetched++; };
  page.customPeriodOpen = true;
  page.customRange = { from: '2026-01-01', to: '2026-01-31' };
  await page.applyCustomRange();
  assert.equal(page.period, 'custom');
  assert.equal(page.customPeriodOpen, false);
  assert.deepEqual({ ...page.range }, { from: '2026-01-01', to: '2026-01-31' });
  assert.equal(fetched, 1);
});
