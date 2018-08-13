import { rollup } from "rollup";
import conditional from "../../src";

export const createRollup = (condition, plugins, input = "test/fixtures/simpleApp") =>
  rollup({
    input,
    treeshake: false,
    plugins: [
      conditional(condition, plugins)
    ]
  });
