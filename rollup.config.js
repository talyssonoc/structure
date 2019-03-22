import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.js',
  external: ['joi', 'lodash'],
  output: {
    name: 'Structure',
    file: 'dist/structure.js',
    format: 'umd',
    globals: {
      joi: 'joi',
      lodash: '_'
    }
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs({
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ]
}
