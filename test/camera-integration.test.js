const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const compiler = require('vue-template-compiler');
const root = path.resolve(__dirname, '..');
const helpers = import(`data:text/javascript;base64,${Buffer.from(fs.readFileSync(path.join(root, 'utils/cameraIntegration.js'), 'utf8')).toString('base64')}`);

function component(file, request) {
  const script = compiler.parseComponent(fs.readFileSync(path.join(root, file), 'utf8')).script.content
    .replace(/import .* from .*;\n/, '').replace('export default', 'module.exports =');
  const sandbox = { cameraAdmin: () => true, cameraRequest: request, module: { exports: {} } };
  vm.runInNewContext(script, sandbox);
  const definition = sandbox.module.exports;
  const context = definition.data();
  Object.assign(context, { isAdmin: true, phoneId: 'p1', $set: (object, key, value) => { object[key] = value; },
    $bvModal: { msgBoxConfirm: async () => true } });
  for (const [name, method] of Object.entries(definition.methods)) context[name] = method.bind(context);
  return { context, definition };
}

test('camera transport requires real admin, forwards Bearer and propagates server errors', async () => {
  const { cameraRequest } = await helpers;
  let sent;
  const context = { $store: { state: { user: { user: { isAdmin: false }, isAdmin: true } } },
    $auth: { strategy: { token: { get: () => 'session' } } },
    $axios: { request: async data => { sent = data; return { data: { success: true } }; } } };
  await assert.rejects(cameraRequest(context, 'get', 'config'), /quản trị/);
  assert.equal(sent, undefined);
  context.$store.state.user.user.isAdmin = true;
  await cameraRequest(context, 'get', 'config');
  assert.equal(sent.headers.Authorization, 'Bearer session');
  assert.equal(sent.url, '/api/camera-integration/config');
  context.$axios.request = async () => { throw { response: { data: { error: 'Camera offline' } } }; };
  await assert.rejects(cameraRequest(context, 'get', 'config'), /Camera offline/);
});

test('phone controls distinguish missing account from failure and ignore stale responses', async () => {
  let respond;
  const { context, definition } = component('components/PhuHuynh/CameraAccount.vue', () => new Promise(resolve => { respond = resolve; }));
  const first = context.load();
  context.phoneId = 'p2'; context.generation++;
  respond({ data: { account: { id: 'old' } } }); await first;
  assert.equal(context.account, null); assert.equal(context.loaded, false);
  const next = context.load(); respond({ data: { account: null } }); await next;
  assert.equal(context.loaded, false);
  assert.equal(context.account, null);
  const failure = component('components/PhuHuynh/CameraAccount.vue', async () => { throw new Error('Offline'); });
  await failure.context.load();
  assert.equal(failure.context.loaded, false);
  assert.equal(failure.context.error, 'Offline');
});

test('settings preserve blank API keys, clear submitted key and stop bulk work on cancellation', async () => {
  const calls = [];
  const { context } = component('pages/setup/camera.vue', async (self, method, route, payload) => {
    calls.push({ method, route, payload });
    if (route === 'phones') return { data: [{ id: 'p1' }] };
    return { data: { baseUrl: 'https://camera.invalid', mapping: {}, apiKeyConfigured: true } };
  });
  context.config.baseUrl = 'https://camera.invalid'; context.apiKey = 'fixture-replacement';
  await context.save();
  assert.equal(calls[0].payload.apiKey, 'fixture-replacement'); assert.equal(context.apiKey, '');
  await context.save(); assert.equal(calls[1].payload.apiKey, undefined);
  context.$bvModal.msgBoxConfirm = async () => false;
  await context.syncAll();
  assert.equal(calls.length, 3); assert.equal(context.busy, false);
});

test('camera templates and scripts compile', () => {
  for (const file of ['pages/setup/camera.vue', 'components/PhuHuynh/CameraAccount.vue', 'components/PhuHuynh/EditModal.vue']) {
    const sfc = compiler.parseComponent(fs.readFileSync(path.join(root, file), 'utf8'));
    const result = compiler.compile(sfc.template.content);
    assert.deepEqual(result.errors, [], file);
    require('@babel/core').transformSync(sfc.script.content, { filename: `${file}.js`, configFile: false, babelrc: false });
  }
});
