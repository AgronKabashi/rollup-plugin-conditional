import pluginApi from "../../src/plugin-api";

export function simple () {
  return {
    name: "simple",
    load () {
      return null;
    }
  };
}

export function transform (transformId = "") {
  return {
    name: "transform",
    load () {
      return null;
    },
    transform (source, id) {
      return `var ${transformId}variable = true;`;
    }
  };
}