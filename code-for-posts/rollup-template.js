const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')

module.exports = ({ srcDir = process.cwd() }) => {
  return {
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
        include: srcDir + '/*',
      }),
    ],
  }
}
