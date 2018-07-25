import { promisifiedSequence } from "./promisifiedSequence";
import { sequence } from "./sequence";
import { once } from "./once";
import { all } from "./all";
import { codeTransformSequencer, stringConcatSequencer } from "./utilities";

const getPluginList = (plugins) => {
  if (typeof plugins === 'function') {
    return plugins();
  } else if (Array.isArray(plugins)) {
    return plugins;
  } else {
    return [];
  }
}

export default function conditional (condition, plugins) {
  if (!condition) {
    return {};
  }

  const pluginList = getPluginList(plugins);
  return pluginList.length ? {
    buildStart: all(pluginList, "buildStart"),
    buildEnd: all(pluginList, "buildEnd"),
    generateBundle: all(pluginList, "generateBundle"),
    load: once(pluginList, "load"),
    resolveId: once(pluginList, "resolveId"),
    options: sequence(pluginList, "options"),
    transform: promisifiedSequence(pluginList, "transform", codeTransformSequencer),
    transformChunk: promisifiedSequence(pluginList, "transformChunk", codeTransformSequencer),
    intro: promisifiedSequence(pluginList, "intro", stringConcatSequencer),
    outro: promisifiedSequence(pluginList, "outro", stringConcatSequencer),
    banner: promisifiedSequence(pluginList, "banner", stringConcatSequencer),
    footer: promisifiedSequence(pluginList, "footer", stringConcatSequencer)
  } : {};
}
