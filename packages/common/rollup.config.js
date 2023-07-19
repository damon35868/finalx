import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
import babel from "@rollup/plugin-babel";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "umd",
    sourcemap: true,
    name: "common",
    globals: {
      react: "react",
      mitt: "mitt",
      jotai: "jotai",
      "taro-hooks": "taro-hooks",
      "@tarojs/taro": "@tarojs/taro",
      "@finalx/common": "@finalx/common",
      "@tarojs/components": "@tarojs/components"
    }
  },
  external: ["react", "@tarojs/taro", "@tarojs/components", "taro-hooks", "jotai", "mitt"],
  plugins: [
    external(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    terser(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: ["@babel/preset-react"]
    })
  ]
};
