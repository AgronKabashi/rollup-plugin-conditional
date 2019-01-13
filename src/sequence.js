import { byHook } from "./utilities";

/**
 * Run the specified plugins in sequence, passing the output to the next plugin in the queue
 * @param {Array<{}>} plugins Collection of rollup plugins
 * @param {string} hookName Name of plugin API method to filter by and execute
 * @returns {Function} A reduced function that returns the final result of all the plugins' results
 */
export const sequence = (plugins, hookName) =>
  (...args) => {
    const [firstPlugin, ...restPlugins] = plugins.filter(byHook(hookName));

    if (!restPlugins.length && !firstPlugin) {
      return null;
    }

    const startingValue = firstPlugin[hookName](...args);

    return restPlugins.reduce((result, plugin) => plugin[hookName](result) || result, startingValue);
  };
