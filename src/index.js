import { promisifiedSequence } from "./promisifiedSequence";
import { sequence } from "./sequence";
import { firstAvailable } from "./firstAvailable";
import { all } from "./all";
import {
  codeTransformSequencer,
  stringConcatSequencer,
  doubleLineStringConcatSequencer
} from "./utilities";

export default function conditional (condition, plugins) {
  if (!condition) {
    return {};
  }

  plugins = typeof plugins === "function" ? plugins() : plugins; // eslint-disable-line no-param-reassign
  if (!Array.isArray(plugins) || !plugins.length) {
    return;
  }

  return {
    name: "rollup-plugin-conditional",
    banner: promisifiedSequence(plugins, "banner", stringConcatSequencer),
    buildEnd: all(plugins, "buildEnd"),
    buildStart: all(plugins, "buildStart"),
    footer: promisifiedSequence(plugins, "footer", stringConcatSequencer),
    generateBundle: all(plugins, ["generateBundle", "ongenerate", "onwrite"]),
    intro: promisifiedSequence(plugins, "intro", doubleLineStringConcatSequencer),
    load: firstAvailable(plugins, "load"),
    options: sequence(plugins, "options"),
    outro: promisifiedSequence(plugins, "outro", doubleLineStringConcatSequencer),
    renderChunk: promisifiedSequence(plugins, ["renderChunk", "transformChunk", "transformBundle"], codeTransformSequencer), // TODO: Issue #4 - Reduce complexity
    renderError: all(plugins, "renderError"),
    renderStart: all(plugins, "renderStart"),
    resolveId: firstAvailable(plugins, "resolveId"),
    resolveDynamicImport: firstAvailable(plugins, "resolveDynamicImport"),
    transform: promisifiedSequence(plugins, "transform", codeTransformSequencer),
    watchChange: sequence(plugins, "watchChange")
  };
}
