import { byMethod } from "./utilities";

/**
 * Run the specified plugins in sequence, passing the output to the next plugin in the queue
 * @param {Array<{}>} plugins Collection of rollup plugins
 * @param {string} methodName Name of plugin API method to filter by and execute
 * @param {Function} callback Callback method for handling the result of each plugin.methodName call
 * @returns {Function} A reduced function that returns the final result of all the plugins' results
 */
export const promisifiedSequence = (plugins, methodName, callback) =>
  (...args) => {
    const [firstPlugin, ...restPlugins] = plugins.filter(byMethod(methodName));

    if (!restPlugins.length && !firstPlugin) {
      return null;
    }

    const startingValue = Promise.resolve(callback(firstPlugin, methodName)(...args));

    return restPlugins.reduce((result, plugin) =>
      result.then(callback(plugin, methodName)), startingValue);
  };
