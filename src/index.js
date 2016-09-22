function ConditionalPlugin(options = {}) {
  if (options.condition) {
    Object.assign(this, options.plugin);
  }
};

export default (config) => new ConditionalPlugin(config);