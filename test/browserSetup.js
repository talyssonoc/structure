require('babel-polyfill');
require('babel!proxy-polyfill');

const tests = require.context('./unit', true, /\.spec\.js$/);

tests.keys().forEach(tests);
