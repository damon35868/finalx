import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";
import babel from "@rollup/plugin-babel";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
      name: "finalx-middleware-esm"
    },
    plugins: [external(), commonjs(), typescript({ tsconfig: "./tsconfig.json" }), terser(), babel()],
    external: ["react", "@tarojs/taro"]
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true
    },
    plugins: [external(), resolve(), commonjs(), typescript({ tsconfig: "./tsconfig.json" }), terser(), babel()],
    external: ["react", "@tarojs/taro"]
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()]
  }
];
