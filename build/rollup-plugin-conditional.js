'use strict';

const ensureArray = input => Array.isArray(input) ? input : [input]; // TODO: Issue #4 - Reduce complexity

const byMethod = names => plugin => ensureArray(names).some(name => plugin.hasOwnProperty(name)); // TODO: Issue #4 - Reduce complexity

const codeTransformSequencer = (plugin, hookNames) =>
  (previousResult = "") => {
    const input = typeof previousResult === "object" ? previousResult.code : previousResult;
    const hookName = ensureArray(hookNames).find(hookName => plugin.hasOwnProperty(hookName)); // TODO: Issue #4 - Reduce complexity
    return plugin[hookName](input) || previousResult;
  };

const stringConcatSequencer = (plugin, hookName, separator = "\n") =>
  async (previousResult = "") => {
    const result = await Promise.resolve(plugin[hookName]());
    return result ? `${previousResult}${previousResult && separator}${result}` : previousResult;
  };

const doubleLineStringConcatSequencer = (...args) => stringConcatSequencer(...args, "\n\n");

/**
 * Execute the plugins in sequence, passing the output of the current to the next plugin in the queue
 * @param {Array<{}>} plugins Collection of rollup plugins
 * @param {string|Array<string>} hookName Name(s) of plugin API method(s) to filter by and execute
 * @param {Function} callback Callback method for handling the result of each plugin.hookName call
 * @returns {Function} A reduced function that returns the final result of all the plugins' results
 */
const promisifiedSequence = (plugins, hookName, callback) =>
  (...args) => {
    const hookNames = ensureArray(hookName); // TODO: Issue #4 - Reduce complexity
    const [firstPlugin, ...restPlugins] = plugins.filter(byMethod(hookNames));

    if (!restPlugins.length && !firstPlugin) {
      return null;
    }

    const startingValue = Promise.resolve(callback(firstPlugin, hookNames)(...args));

    return restPlugins.reduce((result, plugin) =>
      result.then(callback(plugin, hookNames)), startingValue);
  };

/**
 * Run the specified plugins in sequence, passing the output to the next plugin in the queue
 * @param {Array<{}>} plugins Collection of rollup plugins
 * @param {string} hookName Name of plugin API method to filter by and execute
 * @returns {Function} A reduced function that returns the final result of all the plugins' results
 */
const sequence = (plugins, hookName) =>
  (...args) => {
    const [firstPlugin, ...restPlugins] = plugins.filter(byMethod(hookName));

    if (!restPlugins.length && !firstPlugin) {
      return null;
    }

    const startingValue = firstPlugin[hookName](...args);

    return restPlugins.reduce((result, plugin) => plugin[hookName](result), startingValue);
  };

/**
 * Find and return the result of the first plugin with specified hookName that returns a truthy value
 * @param {Array<{}>} plugins Collection of rollup plugins
 * @param {string} hookName Plugin hook to execute
 * @returns {Function} Reduced function that returns the truthy result of the last plugin in the colleciton
 */
const firstAvailable = (plugins, hookName) =>
  (...args) => plugins
    .filter(byMethod(hookName))
    .reduce((output, plugin) => output || plugin[hookName](...args), null);

/**
 * Execute all hooks for the plugins with the specified hookName
 * @param {Array<{}>} plugins Collection of rollup plugins
 * @param {string} hookName Plugin hook to execute
 * @returns {Function} Reduced function that returns the truthy result of the last plugin in the colleciton
 */
const all = (plugins, hookName) =>
  (...args) => {
    const hookNames = ensureArray(hookName); // TODO: Issue #4 - Reduce complexity
    return Promise.all([
      plugins
        .filter(byMethod(hookNames))
        .map(plugin => {
          const hookName = hookNames.find(hookName => plugin.hasOwnProperty(hookName));
          return Promise.resolve(plugin[hookName](...args));
        })
    ]);
  };

function conditional (condition, plugins) {
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

module.exports = conditional;
