import fs from "fs";
import assert from "assert";
import path from "path";
import { rollup } from "rollup";
import conditional from "index";

export const createRollupWithConditional = (condition, plugins, input = "test/fixtures/simpleApp") =>
  rollup({
    input,
    treeshake: false,
    plugins: [
      conditional(condition, plugins)
    ]
  });

export const createRollup = (plugins, input = "test/fixtures/simpleApp") =>
  rollup({
    input,
    treeshake: false,
    plugins
  });

export const saveAndDiscardBundle = async (bundle, id = `${Date.now()}${Math.random()}`) => {
  const file = path.resolve(__dirname, `./output${id}.js`);

  try {
    const result = await bundle.write({
      file,
      format: "es"
    });

    return result.output[0].code;
  }
  finally {
    fs.unlinkSync(file);
  }
};

export const compareRollupResults = async (plugins, input) => {
  const [conditionalBundle, bundle] = await Promise.all([
    createRollupWithConditional(true, plugins, input),
    createRollup(plugins, input)
  ]);

  const conditionalCode = await saveAndDiscardBundle(conditionalBundle);
  const code = await saveAndDiscardBundle(bundle);

  // console.log({
  //   exp: code,
  //   act: conditionalCode
  // });
  assert.equal(conditionalCode, code);
};
