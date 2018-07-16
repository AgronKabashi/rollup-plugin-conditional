import { byMethod } from "./utilities";

export const always = (plugins, methodName) =>
  (...args) => Promise.all([
    plugins
      .filter(byMethod(methodName))
      .map(plugin => Promise.resolve(plugin[methodName](...args)))
  ]);

