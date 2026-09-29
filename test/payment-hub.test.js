const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const compiler = require('vue-template-compiler');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'utils/paymentHub.js'), 'utf8');
const helpers = import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('management requires real isAdmin and explicitly sends the session Bearer', async () => {
  const { paymentHubRequest, paymentHubAdmin } = await helpers;
  let request;
  const context = {
    $store: { state: { user: { user: { isAdmin: false, username: 'admin' }, isAdmin: true, roles: ['super-admin', 'quan-tri-vien'] } } },
    $auth: { strategy: { token: { get: () => 'session-token' } } },
    $axios: { request: async config => { request = config; return { data: { success: true } }; } }
  };
  assert.equal(paymentHubAdmin(context.$store), false);
  assert.throws(() => paymentHubRequest(context, 'post', 'sync'), /quản trị/);
  assert.equal(request, undefined);
  context.$store.state.user.user.isAdmin = true;
  await paymentHubRequest(context, 'get', 'config');
  assert.equal(request.headers.Authorization, 'Bearer session-token');
  assert.equal(request.url, '/api/payment-hub/config');
  context.$auth.strategy.token.get = () => 'Bearer existing';
  await paymentHubRequest(context, 'get', 'config');
  assert.equal(request.headers.Authorization, 'Bearer existing');
  context.$auth.strategy.token.get = () => false;
  assert.throws(() => paymentHubRequest(context, 'post', 'sync'), /đăng nhập/);
});

test('redacted settings preserve secrets and allow direct accounts without VA', async () => {
  const { configPayload, accountList } = await helpers;
  const config = { monapay_enabled: true, webhook_secret_configured: true,
    webhook_secret: '', api_token: '', client_secret: '', auto_sync_interval_mins: 15,
    last_sync_result: { error: 'must not be posted' } };
  const payload = configPayload(config, '001234\n005678,001234', '');
  assert.deepEqual(payload.receiving_accounts, ['001234', '005678']);
  assert.deepEqual(payload.virtual_account_numbers, []);
  for (const key of ['webhook_secret', 'api_token', 'client_secret', 'webhook_secret_configured', 'last_sync_result']) {
    assert.equal(Object.hasOwn(payload, key), false);
  }
  assert.throws(() => configPayload({ ...config, webhook_secret_configured: false }, '001234', ''), /Secret/);
  assert.equal(configPayload({ ...config, webhook_secret: 'replacement' }, '001234', '').webhook_secret, 'replacement');
  assert.throws(() => configPayload({ ...config, webhook_secret: 'monapay_secret_demo' }, '001234', ''), /không hợp lệ/);
  assert.throws(() => configPayload(config, '', ''), /tài khoản nhận/);
  assert.throws(() => accountList('SBX123'), /không hợp lệ/);
  assert.throws(() => accountList(Array(101).fill('123').join('\n')), /không hợp lệ/);
});

test('manual bank payload keeps stable references and rejects invalid VND instead of truncating', async () => {
  const { manualCashPayload } = await helpers;
  const bank = { amount: '50000', paymentMethod: 'ACB_BANK', bankRef: 'REF123', receivingAccount: '001234' };
  assert.deepEqual(manualCashPayload(bank), { amount: 50000, paymentMethod: 'ACB_BANK', bankRef: 'REF123', receivingAccount: '001234', bankDescription: 'Chuyển khoản' });
  for (const amount of ['1.5', '123abc', 0, -1, 2147483648, Infinity]) assert.throws(() => manualCashPayload({ ...bank, amount }), /Số tiền/);
  for (const fields of [{ bankRef: '' }, { receivingAccount: '' }, { bankRef: 'TEST_123' }, { receivingAccount: 'SBX1' }]) {
    assert.throws(() => manualCashPayload({ ...bank, ...fields }));
  }
  const cash = manualCashPayload({ ...bank, paymentMethod: 'CASH' });
  assert.equal(Object.hasOwn(cash, 'bankRef'), false);
  assert.equal(Object.hasOwn(cash, 'receivingAccount'), false);
});

test('settings component saves redacted config through authenticated transport and clears replacements', async () => {
  const api = await helpers;
  const file = fs.readFileSync(path.join(root, 'components/Setup/MonaPaySetting.vue'), 'utf8');
  const script = compiler.parseComponent(file).script.content
    .replace(/import .* from .*;\n/, '').replace('export default', 'module.exports =');
  const sandbox = { ...api, module: { exports: {} } };
  vm.runInNewContext(script, sandbox);
  const component = sandbox.module.exports;
  const context = component.data();
  const calls = [];
  Object.assign(context, {
    loaded: true, config: { monapay_enabled: true, webhook_secret_configured: true, webhook_secret: '', api_token: 'new-token', auto_sync_interval_mins: 15 },
    receivingAccountsText: '001234',
    $store: { state: { user: { user: { isAdmin: true } } } },
    $auth: { strategy: { token: { get: () => 'Bearer session' } } },
    $axios: { request: async request => {
      calls.push(request);
      return { data: { success: true, data: { monapay_enabled: true, webhook_secret_configured: true, api_token_configured: true, receiving_accounts: ['001234'], virtual_account_numbers: [] } } };
    } },
    $bvToast: { toast() {} }
  });
  for (const [name, method] of Object.entries(component.methods)) context[name] = method.bind(context);
  await context.saveConfig();
  assert.equal(context.error, '');
  assert.equal(calls.length, 2);
  assert.equal(calls[0].data.api_token, 'new-token');
  assert.equal(Object.hasOwn(calls[0].data, 'webhook_secret'), false);
  assert.equal(calls[0].headers.Authorization, 'Bearer session');
  assert.equal(context.config.api_token, '');
  assert.equal(context.canSync, false);
  assert.equal(component.methods.sendTestWebhook, undefined);
});

test('changed Vue templates and scripts compile locally', () => {
  for (const file of ['components/Setup/MonaPaySetting.vue', 'pages/dongtien/index.vue']) {
    const sfc = compiler.parseComponent(fs.readFileSync(path.join(root, file), 'utf8'));
    const result = compiler.compile(sfc.template.content);
    assert.deepEqual(result.errors, [], file);
    new vm.Script(require('vue-template-es2015-compiler')(`function render() { ${result.render} }`));
    require('@babel/core').transformSync(sfc.script.content, { filename: file + '.js', configFile: false, babelrc: false });
  }
});
