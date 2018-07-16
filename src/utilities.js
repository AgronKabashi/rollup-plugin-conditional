export const byMethod = methodName => plugin => plugin[methodName];

export const codeTransformSequencer = (plugin, methodName) =>
  (previousResult = "") => {
    const input = typeof previousResult === "object" ? previousResult.code : previousResult;
    return plugin[methodName](input) || previousResult;
  };

export const stringConcatSequencer = (plugin, methodName) =>
  async (previousResult = "") => {
    let result = await Promise.resolve(plugin[methodName]());
    result = result && `\n${result}` || "";
    return `${previousResult}${result}`;
  };
