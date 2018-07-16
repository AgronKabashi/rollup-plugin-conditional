'use strict';

const byMethod = methodName => plugin => plugin[methodName];

const codeTransformSequencer = (plugin, methodName) =>
  (previousResult = "") => {
    const input = typeof previousResult === "object" ? previousResult.code : previousResult;
    return plugin[methodName](input) || previousResult;
  };

const stringConcatSequencer = (plugin, methodName) =>
  async (previousResult = "") => {
    let result = await Promise.resolve(plugin[methodName]());
    result = result && `\n${result}` || "";
    return `${previousResult}${result}`;
  };

/**
 * Run the specified plugins in sequence, passing the output to the next plugin in the queue
 * @param {Array<{}>} plugins Collection of rollup plugins
 * @param {string} methodName Name of plugin API method to filter by and execute
 * @param {Function} callback Callback method for handling the result of each plugin.methodName call
 * @returns {Function} A reduced function that returns the final result of all the plugins' results
 */
const promisifiedSequence = (plugins, methodName, callback) =>
  (...args) => {
    const [firstPlugin, ...restPlugins] = plugins.filter(byMethod(methodName));

    if (!restPlugins.length && !firstPlugin) {
      return null;
    }

    const startingValue = Promise.resolve(callback(firstPlugin, methodName)(...args));

    return restPlugins.reduce((result, plugin) =>
      result.then(callback(plugin, methodName)), startingValue);
  };

/**
 * Run the specified plugins in sequence, passing the output to the next plugin in the queue
 * @param {Array<{}>} plugins Collection of rollup plugins
 * @param {string} methodName Name of plugin API method to filter by and execute
 * @returns {Function} A reduced function that returns the final result of all the plugins' results
 */
const sequence = (plugins, methodName) =>
  (...args) => {
    const [firstPlugin, ...restPlugins] = plugins.filter(byMethod(methodName));

    if (!restPlugins.length && !firstPlugin) {
      return null;
    }

    const startingValue = firstPlugin[methodName](...args);

    return restPlugins.reduce((result, plugin) => plugin[methodName](result), startingValue);
  };

/**
 * Find and return the result of the last plugin in the collection that returns a truthy value
 * @param {Array<{}>} plugins Collection of rollup plugins
 * @param {string} methodName Name of plugin API method to filter by and execute
 * @returns {Function} Reduced function that returns the truthy result of the last plugin in the colleciton
 */
const once = (plugins, methodName) =>
  (...args) => plugins
    .filter(byMethod(methodName))
    .reduceRight((output, plugin) => output || plugin[methodName](...args), null);

const all = (plugins, methodName) =>
  (...args) => Promise.all([
    plugins
      .filter(byMethod(methodName))
      .map(plugin => Promise.resolve(plugin[methodName](...args)))
  ]);

function conditional (condition, plugins) {
  if (!condition || !Array.isArray(plugins) || plugins.length === 0) {
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
    transformChunk: promisifiedSequence(plugins, "transformChunk", codeTransformSequencer),
    intro: promisifiedSequence(plugins, "intro", stringConcatSequencer),
    outro: promisifiedSequence(plugins, "outro", stringConcatSequencer),
    banner: promisifiedSequence(plugins, "banner", stringConcatSequencer),
    footer: promisifiedSequence(plugins, "footer", stringConcatSequencer)
  };
}

module.exports = conditional;
