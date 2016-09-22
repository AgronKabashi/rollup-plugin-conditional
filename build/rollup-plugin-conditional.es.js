function ConditionalPlugin(options = {}) {
  if (options.condition) {
    Object.assign(this, options.plugin);
  }
}

var index = (config) => new ConditionalPlugin(config);

export default index;
