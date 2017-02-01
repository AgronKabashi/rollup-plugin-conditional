const pluginApi = [
  'load',
  'resolveId',
  'transform',
  'transformBundle'
];

const pluginApiCallbacks = [
  'ongenerate',
  'onwrite'
];

const pluginApiStringInjections = [
  'intro',
  'outro',
  'banner',
  'footer'
];

function getFirstExecutablePlugin(apiName, plugins, ...args) {
  // Will return the result of the very first plugin that supports the api call and doesn't return a falsy value
  return plugins.reduce((result, plugin) => result || plugin[apiName] && plugin[apiName](...args), undefined);
}

var index = (arg1 = {}, arg2) => {
  let condition = false;
  let plugins = [];

  if (Array.isArray(arg2)) {
    condition = !!arg1;
    plugins = arg2;
  }
  // Deprecated in 1.1.0
  else if (typeof arg1 === "object") {
    console.warn("This syntax is deprecated, please use conditional(condition, plugins) instead.");
    condition = !!arg1.condition;
    plugins = arg1.plugins;
  }

  if (!condition || !Array.isArray(plugins) || plugins.length === 0) {
    return {};
  }

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

export default index;
