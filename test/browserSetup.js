// Polyfills needed on PhantomJS
global.Map = require('es6-map');
global.Symbol = require('es6-symbol');
require('proxy-polyfill');

const tests = require.context('./unit', true, /\.spec\.js$/);

tests.keys().forEach(tests);
