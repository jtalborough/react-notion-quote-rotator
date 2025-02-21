import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import { defineConfig } from 'rollup';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

export default defineConfig({
  input: 'src/index.ts',
  output: [{
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true,
  }],
  plugins: [
    external(),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['**/__tests__/**'],
    }),
    postcss({
      extract: true,
      modules: false,
      use: ['sass'],
    }),
  ],
});

