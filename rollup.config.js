import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import html2 from "rollup-plugin-html2";
import svelte from "rollup-plugin-svelte";
import serve from "rollup-plugin-serve";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";
import sveltePreprocessor from "svelte-preprocess";
let static_files = require('rollup-plugin-static-files');

const isDevelopment = process.env.NODE_ENV === "development";

const plugins = [
  svelte({
    dev: isDevelopment,
    extensions: [".svelte"],
    preprocess: sveltePreprocessor(),
    emitCss: true,
  }),
  postcss({
    extract: true,
  }),
  commonjs({ include: "node_modules/**", extensions: [".js"] }),
  resolve(),
  html2({
    template: 'src/index.html',
    onlinePath: '.'
  }),
  static_files({
    include: ['./img']
  })
];
if (isDevelopment) {
  plugins.push(
    serve({
      contentBase: "./docs",
      open: false,
      host: '0.0.0.0',
      port: 1523 // WSL: 1522 (SSH) ~ 1528 is opened for test.
    }),
    livereload({ watch: "./src" })
  );
} else {
  plugins.push(terser({ sourcemap: true }));
}

module.exports = {
  input: "src/index.js",
  output: {
    file: "docs/index.js",
    sourcemap: true,
    format: "iife",
  },
  plugins,
};
