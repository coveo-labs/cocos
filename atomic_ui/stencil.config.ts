import { Config } from "@stencil/core";
import dotenvPlugin from "rollup-plugin-dotenv";
import html from "rollup-plugin-html";
import { postcss } from "@stencil/postcss";
import tailwind from "tailwindcss";

// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: "src/style/index.css",
  taskQueue: "async",
  outputTargets: [
    {
      type: "www",
      serviceWorker: null, // disable service workers
      copy: [{ src: "pages", keepDirStructure: false }],
    },
  ],
  plugins: [
    dotenvPlugin(),
    postcss({
      plugins: [tailwind()],
    }),
  ],
  rollupPlugins: {
    before: [
      html({
        include: "src/components/**/*.html",
      }),
      html({
        include: "src/components/**/*.svg",
      }),
    ],
  },
};
