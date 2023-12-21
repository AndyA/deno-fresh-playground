import sass from "https://deno.land/x/denosass/mod.ts";
// import { SassOptions } from "https://deno.land/x/denosass@1.0.6/src/types/module.types.ts";

const compileSass = async (src: string): Promise<string> => {
  const scss = await Deno.readFile(src);
  const compile = sass(scss);
  const res = compile.to_string("expanded");
  if (res === false) throw new Error(`Failed to compile ${src}`);
  if (typeof res === "string") return res;
  throw new Error(`Bang!`);
};

const css = await compileSass("static/styles.css");
console.log(css);
