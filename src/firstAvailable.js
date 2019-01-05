import { byMethod } from "./utilities";

/**
 * Find and return the result of the first plugin with specified hookName that returns a truthy value
 * @param {Array<{}>} plugins Collection of rollup plugins
 * @param {string} hookName Plugin hook to execute
 * @returns {Function} Reduced function that returns the truthy result of the last plugin in the colleciton
 */
export const firstAvailable = (plugins, hookName) =>
  (...args) => plugins
    .filter(byMethod(hookName))
    .reduce((output, plugin) => output || plugin[hookName](...args), null);
