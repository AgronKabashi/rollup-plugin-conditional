'use strict';

const byHook = hookName => plugin => plugin.hasOwnProperty(hookName);

/**
 * Run the specified plugins in sequence, passing the output to the next plugin in the queue
 * @param {Array<{}>} plugins Collection of rollup plugins
 * @param {string} hookName Name of plugin API method to filter by and execute
 * @returns {Function} A reduced function that returns the final result of all the plugins' results
 */
const sequence = (plugins, hookName) =>
  (...args) => {
    const [firstPlugin, ...restPlugins] = plugins.filter(byHook(hookName));

    if (!restPlugins.length && !firstPlugin) {
      return null;
    }

    const startingValue = firstPlugin[hookName](...args);

    return restPlugins.reduce((result, plugin) => plugin[hookName](result) || result, startingValue);
  };

function conditional (condition, plugins) {
  if (!condition) {
    return {};
  }

  plugins = typeof plugins === "function" ? plugins() : plugins; // eslint-disable-line no-param-reassign
  if (!Array.isArray(plugins) || !plugins.length) {
    return;
  }

  const conditionalUniqueId = `${Date.now()}${Math.random()}`;

  return {
    name: "rollup-plugin-conditional",
    conditionalUniqueId,
    options: inputOptions => {
      const conditionalPluginIndex = inputOptions.plugins.findIndex(plugin => plugin.conditionalUniqueId === conditionalUniqueId);
      if (conditionalPluginIndex >= 0) {
        // Inject the supplied plugins into conditional's position
        inputOptions.plugins.splice(conditionalPluginIndex, 1, ...plugins);
      }

      // The options hook needs to be called manually for the supplied plugins
      return sequence(plugins, "options")(inputOptions);
    }
  };
}

module.exports = conditional;
