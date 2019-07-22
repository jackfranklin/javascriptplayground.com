import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'

export default {
  input: 'index.jsx',
  output: {
    file: 'bundle.js',
    format: 'iife',
  },
  plugins: [
    resolve({
      extensions: ['.mjs', '.js', '.jsx', '.json'],
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    babel({
      babelrc: false,
      presets: [['@babel/env', { modules: false }], '@babel/preset-react'],
      exclude: 'node_modules/**',
    }),
  ],
}
