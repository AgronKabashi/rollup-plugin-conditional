import { byMethod } from "./utilities";

/**
 * Find and return the result of the last plugin in the collection that returns a truthy value
 * @param {Array<{}>} plugins Collection of rollup plugins
 * @param {string} methodName Name of plugin API method to filter by and execute
 * @returns {Function} Reduced function that returns the truthy result of the last plugin in the colleciton
 */
export const once = (plugins, methodName) =>
  (...args) => plugins
    .filter(byMethod(methodName))
    .reduceRight((output, plugin) => output || plugin[methodName](...args), null);
