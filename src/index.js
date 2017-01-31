import {pluginApi, pluginApiCallbacks, pluginApiStringInjections} from "./plugin-api";

function getFirstExecutablePlugin(apiName, plugins, ...args) {
  // Will return the result of the very first plugin that supports the api call and doesn't return a falsy value
  return plugins.reduce((result, plugin) => result || plugin[apiName] && plugin[apiName](...args), undefined);
}

export default (options = {}) => {
  if (!options.condition || !Array.isArray(options.plugins) || options.plugins.length === 0) {
    return {};
  }

  const { plugins } = options;

  const constructedApi = {};

  pluginApi.reduce((api, apiName) => {
    api[apiName] = (...args) => getFirstExecutablePlugin(apiName, plugins, ...args);
    return api;
  }, constructedApi);

  pluginApiCallbacks.reduce((api, apiName) => {
    api[apiName] = (...args) => plugins.forEach(plugin => plugin[apiName] && plugin[apiName](...args));
    return api;
  }, constructedApi);

  pluginApiStringInjections.reduce((api, apiName) => {
    api[apiName] = (...args) => plugins.reduce((result, plugin) => result + (plugin[apiName] && plugin[apiName](...args) || ''), '');
    return api;
  }, constructedApi);

  return constructedApi;
};