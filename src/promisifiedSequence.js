import { byMethod, ensureArray } from "./utilities";

/**
 * Execute the plugins in sequence, passing the output of the current to the next plugin in the queue
 * @param {Array<{}>} plugins Collection of rollup plugins
 * @param {string|Array<string>} hookName Name(s) of plugin API method(s) to filter by and execute
 * @param {Function} callback Callback method for handling the result of each plugin.hookName call
 * @returns {Function} A reduced function that returns the final result of all the plugins' results
 */
export const promisifiedSequence = (plugins, hookName, callback) =>
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
