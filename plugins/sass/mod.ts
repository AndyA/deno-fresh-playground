import sass from "$sass/mod.ts";

import type {
  Handlers,
  Plugin,
  PluginAsyncRenderContext,
  PluginRenderContext,
  PluginRenderResult,
  ResolvedFreshConfig,
} from "$fresh/server.ts";

import type { SassOptions } from "$sass/src/types/module.types.ts";

export interface SassPluginConfig extends SassOptions {
  sassRoot?: string;
}

const defaultConfig = {
  sassRoot: "styles",
};

export const compileSass = async (
  src: string,
  options: SassOptions,
): Promise<Uint8Array> => {
  const scss = await Deno.readFile(src);
  const res = sass(scss, options).to_buffer("expanded");
  if (res instanceof Uint8Array) return res;
  if (res === false) throw new Error(`Failed to compile ${src}`);
  throw new Error(`Bang!`);
};

const sassPlugin: (config?: SassPluginConfig) => Plugin = (config = {}) => {
  const { sassRoot, ...options } = { ...defaultConfig, ...config };

  const handler: Handlers = {
    async GET(req) {
      const path = sassRoot +
        new URL(req.url).pathname.replace(/\.css$/i, "");
      console.log(`${req.url} -> ${path}`);
      const css = await compileSass(path, options);
      return new Response(css, { headers: { "Content-Type": "text/css" } });
    },
  };

  return ({
    name: "sass-plugin",

    render(ctx: PluginRenderContext): PluginRenderResult {
      const res = ctx.render();
      console.log(`render`, { ctx, res });
      return res;
    },

    async renderAsync(
      ctx: PluginAsyncRenderContext,
    ): Promise<PluginRenderResult> {
      const res = await ctx.renderAsync();
      console.log(`renderAsync`, { ctx, res });
      return res;
    },

    buildStart(config: ResolvedFreshConfig) {
      console.log(`buildStart`, config);
    },

    buildEnd() {
      console.log(`buildEnd`);
    },

    routes: [
      { path: "(.+).scss.css", handler },
      { path: "(.+).sass.css", handler },
    ],
  });
};

export default sassPlugin;
