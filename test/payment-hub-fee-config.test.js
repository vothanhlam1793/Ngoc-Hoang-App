const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const compiler = require('vue-template-compiler');
const root = path.resolve(__dirname, '..');

test('fee config page template and script compile', () => {
  const file = 'pages/khoanphi/cauhinh.vue';
  const sfc = compiler.parseComponent(fs.readFileSync(path.join(root, file), 'utf8'));
  const result = compiler.compile(sfc.template.content);
  assert.deepEqual(result.errors, [], file);
  new vm.Script(require('vue-template-es2015-compiler')(`function render() { ${result.render} }`));
  require('@babel/core').transformSync(sfc.script.content, { filename: `${file}.js`, configFile: false, babelrc: false });
});
