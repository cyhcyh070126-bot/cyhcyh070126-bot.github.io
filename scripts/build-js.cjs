const fs = require('node:fs');
const path = require('node:path');
const { minify } = require('uglify-js');
const root = path.join(__dirname, '..');
const inputs = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/fitvids/dist/fitvids.min.js',
  'node_modules/jquery-smooth-scroll/jquery.smooth-scroll.min.js',
  'assets/js/plugins/jquery.greedy-navigation.js',
  'assets/js/_main.js'
];
const sources = Object.fromEntries(inputs.map(file => [file, fs.readFileSync(path.join(root, file), 'utf8')]));
const result = minify(sources, { compress: true, mangle: true });
if (result.error) throw result.error;
fs.writeFileSync(path.join(root, 'assets/js/main.min.js'), result.code);
fs.copyFileSync(path.join(root, 'node_modules/plotly.js-dist-min/plotly.min.js'), path.join(root, 'assets/js/plotly.min.js'));
