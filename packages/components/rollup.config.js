import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "umd",
    sourcemap: true,
    name: "common",
    globals: {
      react: "react",
      classnames: "classnames",
      "@tarojs/taro": "@tarojs/taro",
      "@finalx/common": "@finalx/common",
      "@tarojs/components": "@tarojs/components"
    }
  },
  external: ["react", "@tarojs/taro", "@tarojs/components"],
  plugins: [
    postcss({
      inject: true,
      minimize: true, // 是否压缩CSS
      extract: "style.css"
    }),
    typescript({ tsconfig: "./tsconfig.json" }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: ["@babel/preset-react"]
    })
  ]
};
