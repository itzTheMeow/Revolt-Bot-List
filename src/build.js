const useAutoprefixer = require("autoprefixer");
const esbuild = require("esbuild");
const postCssPlugin = require("esbuild-style-plugin");
const esbuildSvelte = require("esbuild-svelte");
const fs = require("fs");
const sveltePreprocess = require("svelte-preprocess");
const useTailwind = require("tailwindcss");

console.log("Building client...");
esbuild
  .build({
    entryPoints: [`./site/src/index.ts`],
    bundle: true,
    outdir: `./site/dist`,
    mainFields: ["svelte", "browser", "module", "main"],
    minify: false,
    sourcemap: "inline",
    splitting: true,
    write: true,
    format: `esm`,
    watch: process.argv.includes(`--watch`),
    plugins: [
      esbuildSvelte({
        filterWarnings: (w) => !w.code.startsWith("a11y-"),
        preprocess: sveltePreprocess(),
      }),
      postCssPlugin({
        postcss: {
          plugins: [useTailwind, useAutoprefixer],
        },
      }),
    ],
    logLevel: "info",
    target: "es6",
    loader: { ".png": "file" },
    tsconfig: "./site/tsconfig.json",
  })
  .then(() => {
    fs.copyFileSync("./site/src/index.html", "./site/dist/index.html");
  })
  .catch((error, location) => {
    console.warn(`Errors: `, error, location);
    process.exit(1);
  });
