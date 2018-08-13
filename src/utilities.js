const ensureArray = input => Array.isArray(input) ? input : [input]; // TODO: Issue #4 - Reduce complexity

export const byMethod = methodNames => plugin => ensureArray(methodNames).some(methodName => plugin.hasOwnProperty(methodName)); // TODO: Issue #4 - Reduce complexity

export const codeTransformSequencer = (plugin, methodNames) =>
  (previousResult = "") => {
    const input = typeof previousResult === "object" ? previousResult.code : previousResult;
    const methodName = ensureArray(methodNames).find(methodName => plugin.hasOwnProperty(methodName)); // TODO: Issue #4 - Reduce complexity
    return plugin[methodName](input) || previousResult;
  };

export const stringConcatSequencer = (plugin, methodName) =>
  async (previousResult = "") => {
    let result = await Promise.resolve(plugin[methodName]());
    result = result && `\n${result}` || "";
    return `${previousResult}${result}`;
  };
