import { defineConfig } from "$fresh/server.ts";

import sassPlugin from "./plugins/sass/mod.ts";

export default defineConfig({
  plugins: [sassPlugin({ root: "styles" })],
});
