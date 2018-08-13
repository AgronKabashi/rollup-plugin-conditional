import { promisifiedSequence } from "./promisifiedSequence";
import { sequence } from "./sequence";
import { once } from "./once";
import { all } from "./all";
import { codeTransformSequencer, stringConcatSequencer } from "./utilities";

export default function conditional (condition, plugins) {
  if (!condition) {
    return {};
  }

  plugins = typeof plugins === "function" ? plugins() : plugins; // eslint-disable-line no-param-reassign
  if (!Array.isArray(plugins) || !plugins.length) {
    return {};
  }

  return {
    buildStart: all(plugins, "buildStart"),
    buildEnd: all(plugins, "buildEnd"),
    generateBundle: all(plugins, "generateBundle"),
    load: once(plugins, "load"),
    resolveId: once(plugins, "resolveId"),
    options: sequence(plugins, "options"),
    transform: promisifiedSequence(plugins, "transform", codeTransformSequencer),
    transformChunk: promisifiedSequence(plugins, ["transformChunk", "transformBundle"], codeTransformSequencer), // TODO: Issue #4 - Reduce complexity
    ongenerate: all(plugins, "ongenerate"), // TODO: Issue #4 - Reduce complexity
    onwrite: all(plugins, "onwrite"), // TODO: Issue #4 - Reduce complexity
    intro: promisifiedSequence(plugins, "intro", stringConcatSequencer),
    outro: promisifiedSequence(plugins, "outro", stringConcatSequencer),
    banner: promisifiedSequence(plugins, "banner", stringConcatSequencer),
    footer: promisifiedSequence(plugins, "footer", stringConcatSequencer)
  };
}
