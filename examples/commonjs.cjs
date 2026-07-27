// The same API works with CommonJS `require`.
// In your project: const webp = require('webp-converter');
const webp = require('../dist/index.cjs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const out = path.join(__dirname, 'output');

webp.grant_permission();

// Every function returns a Promise — use async/await or .then().
webp
  .cwebp(path.join(root, 'nodejs_logo.jpg'), path.join(out, 'commonjs.webp'), '-q 80')
  .then((res) => console.log('✓ CommonJS conversion done', res || ''))
  .catch((err) => {
    console.error('✗ failed:', err.message);
    process.exitCode = 1;
  });
