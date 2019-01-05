export const ensureArray = input => Array.isArray(input) ? input : [input]; // TODO: Issue #4 - Reduce complexity

export const byMethod = names => plugin => ensureArray(names).some(name => plugin.hasOwnProperty(name)); // TODO: Issue #4 - Reduce complexity

export const codeTransformSequencer = (plugin, hookNames) =>
  (previousResult = "") => {
    const input = typeof previousResult === "object" ? previousResult.code : previousResult;
    const hookName = ensureArray(hookNames).find(hookName => plugin.hasOwnProperty(hookName)); // TODO: Issue #4 - Reduce complexity
    return plugin[hookName](input) || previousResult;
  };

export const stringConcatSequencer = (plugin, hookName, separator = "\n") =>
  async (previousResult = "") => {
    const result = await Promise.resolve(plugin[hookName]());
    return result ? `${previousResult}${previousResult && separator}${result}` : previousResult;
  };

export const doubleLineStringConcatSequencer = (...args) => stringConcatSequencer(...args, "\n\n");
