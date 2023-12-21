import sass from "$sass/mod.ts";
import { walk } from "$std/fs/walk.ts";
import { dirname, join, relative } from "$std/path/mod.ts";

import type { Handlers, Plugin, ResolvedFreshConfig } from "$fresh/server.ts";
import type { SassOptions } from "$sass/src/types/module.types.ts";

export interface SassPluginConfig extends SassOptions {
  sassRoot?: string;
}

const defaultConfig = {
  sassRoot: "styles",
};

async function compileSassFile(
  file: string,
  options: SassOptions,
): Promise<Uint8Array> {
  // console.log(`sass compiling ${file}`);
  const src = await Deno.readFile(file);
  const css = sass(src, options).to_buffer();
  if (css instanceof Uint8Array) return css;
  if (css === false) throw new Error(`Failed to compile ${file}`);
  throw new Error(`Bang!`);
}

async function writeAtomic(file: string, data: Uint8Array) {
  await Deno.mkdir(dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  await Deno.writeFile(tmp, data);
  await Deno.rename(tmp, file);
}

async function compileDir(
  root: string,
  outDir: string,
  options: SassOptions,
) {
  const iter = walk(root, { exts: [".sass", ".scss"] });
  for await (const file of iter) {
    const outFile = join(outDir, relative(root, `${file.path}.css`));
    const css = await compileSassFile(file.path, options);
    await writeAtomic(outFile, css);
  }
}

const sassPlugin: (config?: SassPluginConfig) => Plugin = (config = {}) => {
  const { sassRoot, ...options } = { ...defaultConfig, ...config };

  const handler: Handlers = {
    async GET(req) {
      const path = sassRoot +
        new URL(req.url).pathname.replace(/\.css$/i, "");
      const css = await compileSassFile(path, options);
      return new Response(css, { headers: { "Content-Type": "text/css" } });
    },
  };

  return ({
    name: "sass-plugin",

    async buildStart(config: ResolvedFreshConfig) {
      await compileDir(sassRoot, join(config.build.outDir, "static"), options);
    },

    routes: [
      { path: "(.+).sass.css", handler },
      { path: "(.+).scss.css", handler },
    ],
  });
};

export default sassPlugin;
