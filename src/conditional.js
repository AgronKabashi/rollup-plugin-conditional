import { promisifiedSequence } from "./promisifiedSequence";
import { sequence } from "./sequence";
import { once } from "./once";
import { always } from "./always";
import { codeTransformSequencer, stringConcatSequencer } from "./utilities";

export default function conditional (condition, plugins) {
  if (!condition || !Array.isArray(plugins) || plugins.length === 0) {
    return {};
  }

  return {
    buildStart: always(plugins, "buildStart"),
    buildEnd: always(plugins, "buildEnd"),
    generateBundle: always(plugins, "generateBundle"),
    load: once(plugins, "load"),
    resolveId: once(plugins, "resolveId"),
    options: sequence(plugins, "options"),
    transform: promisifiedSequence(plugins, "transform", codeTransformSequencer),
    transformChunk: promisifiedSequence(plugins, "transformChunk", codeTransformSequencer),
    intro: promisifiedSequence(plugins, "intro", stringConcatSequencer),
    outro: promisifiedSequence(plugins, "outro", stringConcatSequencer),
    banner: promisifiedSequence(plugins, "banner", stringConcatSequencer),
    footer: promisifiedSequence(plugins, "footer", stringConcatSequencer)
  };
}
