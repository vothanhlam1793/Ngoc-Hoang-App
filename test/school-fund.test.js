const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const compiler = require('vue-template-compiler');
const parser = require('@babel/parser');
const source = fs.readFileSync(path.join(__dirname, '../pages/quytruong.vue'), 'utf8');

function setup(request = async () => ({data: {data: {cash: 100, rows: [], total: 0}}}), saved) {
  const storage = new Map(saved ? [['school-fund-pending', JSON.stringify(saved)]] : []);
  let ids = 0;
  const context = {
    paymentHubRequest: request,
    sessionStorage: {
      getItem: key => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: key => storage.delete(key)
    },
    window: {crypto: {randomUUID: () => `operation-${++ids}`}}
  };
  vm.runInNewContext(compiler.parseComponent(source).script.content
    .replace(/^import .*$/gm, '').replace('export default', 'component ='), context);
  const page = {...context.component.data(), $store: {state: {user: {user: {id: 'admin'}}}},
    $nextTick: fn => fn(), $refs: {amount: {focus() {}}}};
  for (const [name, method] of Object.entries(context.component.methods)) page[name] = method.bind(page);
  return {page, storage, component: context.component, ids: () => ids};
}

test('Vue template compiles and script parses with Babel', () => {
  const sfc = compiler.parseComponent(source);
  assert.deepEqual(compiler.compile(sfc.template.content).errors, []);
  assert.doesNotThrow(() => parser.parse(sfc.script.content, {sourceType: 'module'}));
});

test('operational UI hides raw identifiers and offers modal, responsive table and global retry', () => {
  const template = compiler.parseComponent(source).template.content;
  assert.match(template, /<h1[^>]*>Quỹ trường<\/h1>/);
  assert.match(template, /Còn được rút/);
  assert.match(template, /v-if="formOpen"/);
  assert.match(template, /table-responsive/);
  assert.match(template, /<b-modal/);
  assert.doesNotMatch(source, /window\.prompt/);
  assert.doesNotMatch(template, /\{\{[^}]*row\.(?:_id|userId|sourceId|code)/);
  assert.match(template, /Chưa có tên người lập/);
  assert.ok(template.indexOf('@click="sendPending"') < template.indexOf('<div v-if="fund">'));
  assert.ok(template.indexOf('@click="load"') < template.indexOf('<div v-if="fund">'));
});

test('Vietnamese datetime uses Ho Chi Minh timezone and handles absent/invalid dates', () => {
  const {page} = setup();
  assert.match(page.dateTime('2026-01-01T18:05:00Z'), /01:05/);
  assert.match(page.dateTime('2026-01-01T18:05:00Z'), /02\/01\/2026/);
  assert.equal(page.dateTime(null), 'Chưa có thời điểm');
  assert.equal(page.dateTime('invalid'), 'Chưa có thời điểm');
});

test('financial periods use Vietnam calendar days and weeks start on Monday', () => {
  const {page} = setup();
  assert.deepEqual({...page.periodRange('this-week', new Date('2026-09-28T03:00:00Z'))}, {from: '2026-09-28', to: '2026-10-04'});
  assert.deepEqual({...page.periodRange('last-week', new Date('2026-09-28T03:00:00Z'))}, {from: '2026-09-21', to: '2026-09-27'});
  assert.deepEqual({...page.periodRange('this-month', new Date('2026-09-28T03:00:00Z'))}, {from: '2026-09-01', to: '2026-09-30'});
  assert.deepEqual({...page.periodRange('last-month', new Date('2026-01-15T03:00:00Z'))}, {from: '2025-12-01', to: '2025-12-31'});
});

test('changing period resets pagination and requests only the selected range', async () => {
  let url;
  const {page} = setup(async (_, method, path) => { url = path; return {data: {data: {cash: 100, rows: [], total: 0}}}; });
  page.page = 4;
  page.busy = false;
  page.range = {from: '2026-01-01', to: '2026-01-31'};
  await page.selectPeriod('last-week');
  assert.equal(page.page, 1);
  assert.match(url, /^school-fund\?page=1&from=\d{4}-\d{2}-\d{2}&to=\d{4}-\d{2}-\d{2}$/);
});

test('school fund custom modal preserves applied period until valid confirmation', async () => {
  const {page} = setup();
  page.period = 'this-week';
  page.range = {from: '2026-09-28', to: '2026-10-04'};
  await page.selectPeriod('custom');
  assert.equal(page.period, 'this-week');
  assert.equal(page.customPeriodOpen, true);
  page.customRange = {from: '2026-10-04', to: '2026-09-28'};
  await page.applyCustomRange();
  assert.equal(page.customPeriodOpen, true);
  assert.equal(page.customRangeError, 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc');
  page.cancelCustomRange();
  assert.equal(page.customPeriodOpen, false);
  assert.deepEqual({...page.customRange}, page.range);
});

test('school fund applies custom period, closes modal and resets page', async () => {
  const {page} = setup();
  let loaded = 0;
  page.load = async () => { loaded++; };
  page.page = 5;
  page.customPeriodOpen = true;
  page.customRange = {from: '2026-01-01', to: '2026-01-31'};
  await page.applyCustomRange();
  assert.equal(page.period, 'custom');
  assert.equal(page.customPeriodOpen, false);
  assert.equal(page.page, 1);
  assert.equal(loaded, 1);
});

test('initial failure remains retryable without a fund and failed pagination keeps current page', async () => {
  let fail = true;
  const {page} = setup(async () => {
    if (fail) throw new Error('Không tải được sổ');
    return {data: {data: {cash: 100, total: 100, rows: []}}};
  });
  await page.load();
  assert.equal(page.fund, null);
  assert.equal(page.busy, false);
  assert.equal(page.error, 'Không tải được sổ');
  fail = false;
  await page.load();
  assert.equal(page.error, '');
  fail = true;
  await page.changePage(1);
  assert.equal(page.page, 1);
});

test('voucher retry preserves persisted payload and operationId despite form changes', async () => {
  const sent = [];
  let fail = true;
  const {page, storage, ids} = setup(async (_, method, url, body) => {
    if (method === 'post') {
      assert.equal(storage.get('school-fund-pending'), JSON.stringify(page.pending));
      sent.push(JSON.stringify({url, body}));
      if (fail) throw new Error('Network interrupted');
    }
    return {data: {data: {cash: 90, total: 0, rows: []}}};
  });
  page.openForm('WITHDRAWAL');
  Object.assign(page.form, {amount: 10, reason: 'Chi phí', counterparty: 'Người nhận'});
  await page.submit();
  assert.ok(page.pending);
  assert.equal(ids(), 1);
  page.form.amount = 999;
  page.reverse({_id: 'other', delta: 9});
  assert.equal(page.reversalOpen, false);
  fail = false;
  await page.submit();
  assert.equal(sent[0], sent[1]);
  assert.equal(ids(), 1);
  assert.equal(storage.size, 0);
  assert.equal(page.pending, null);
  assert.equal(page.formOpen, false);
  assert.equal(page.fund.cash, 90);
});

test('reversal requires confirmation/reason and retries restored session payload unchanged', async () => {
  const {page, storage, ids} = setup(async () => { throw new Error('Timeout'); });
  page.fund = {cash: 100};
  page.reverse({_id: 'voucher-private', type: 'WITHDRAWAL', delta: -20});
  assert.equal(page.reversalOpen, true);
  assert.equal(page.pending, null);
  await page.confirmReversal();
  assert.equal(ids(), 0);
  page.reversalReason = '  Nhập sai  ';
  await page.confirmReversal();
  const saved = JSON.parse(storage.get('school-fund-pending'));
  assert.deepEqual(saved, {path: 'school-fund/reversals', body: {
    operationId: 'operation-1', voucherId: 'voucher-private', reason: 'Nhập sai'
  }});
  let posted;
  const restored = setup(async (_, method, url, body) => {
    if (method === 'post') posted = JSON.parse(JSON.stringify({path: url, body}));
    return {data: {data: {cash: 120, rows: [], total: 0}}};
  }, saved);
  restored.component.mounted.call(restored.page);
  // Mounted starts the initial load; settle it before simulating a retry click.
  await new Promise(resolve => setImmediate(resolve));
  await restored.page.sendPending();
  assert.deepEqual(posted, saved);
  assert.equal(restored.ids(), 0);
  assert.equal(restored.storage.size, 0);
});

test('busy guards prevent duplicate submissions and existing definitive-error clearing is preserved', async () => {
  for (const status of [400, 401, 403, 409, 503]) {
    const {page, storage} = setup(async () => { throw {response: {status, data: {error: 'Rejected'}}}; });
    page.pending = {path: 'school-fund/vouchers', body: {operationId: 'existing'}};
    page.busy = true;
    await page.sendPending();
    assert.equal(storage.size, 0);
    assert.ok(page.pending);
    page.busy = false;
    await page.sendPending();
    assert.equal(page.pending, null);
    assert.equal(storage.size, 0);
    assert.equal(page.error, 'Rejected');
  }
});

test('direct navigation waits for roles before requesting school fund', async () => {
  const source = fs.readFileSync(path.join(__dirname, '../pages/quytruong.vue'), 'utf8');
  const script = source.match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .*$/gm, '').replace('export default', 'component =');
  let ready;
  let requests = 0;
  const store = {state: {user: {user: {}}}, dispatch: () => new Promise(resolve => {ready = () => {
    store.state.user.user = {id: 'admin', isAdmin: true}; resolve();
  };})};
  const ctx = {paymentHubRequest: async () => {
    assert.equal(store.state.user.user.isAdmin, true);
    requests++;
    return {data: {data: {cash: 10}}};
  }};
  vm.runInNewContext(script, ctx);
  const page = {$store: store, page: 1, range: {from: '2026-09-28', to: '2026-10-04'}};
  const pending = ctx.component.methods.load.call(page);
  assert.equal(requests, 0);
  ready();
  await pending;
  assert.equal(requests, 1);
  assert.equal(page.fund.cash, 10);
  assert.equal(page.busy, false);
});
