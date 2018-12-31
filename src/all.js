import { byMethod, ensureArray } from "./utilities";

/**
 * Execute all hooks for the plugins with the specified hookName
 * @param {Array<{}>} plugins Collection of rollup plugins
 * @param {string} hookName Plugin hook to execute
 * @returns {Function} Reduced function that returns the truthy result of the last plugin in the colleciton
 */
export const all = (plugins, hookName) =>
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
