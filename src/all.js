import { byMethod } from "./utilities";

export const all = (plugins, methodName) =>
  (...args) => Promise.all([
    plugins
      .filter(byMethod(methodName))
      .map(plugin => Promise.resolve(plugin[methodName](...args)))
  ]);

