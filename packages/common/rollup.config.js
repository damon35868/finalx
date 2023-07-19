import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import babel from "@rollup/plugin-babel";

export default [
  {
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
      typescript({ tsconfig: "./tsconfig.json" }),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: ["@babel/preset-react"]
      })
    ]
  },
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()]
  }
];
