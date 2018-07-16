import assert from "assert";
import { createRollup } from "./utilities/createRollupConfig";
import { saveAndDiscardBundle } from "./utilities/saveAndDiscardBundle";

describe("banner", () => {
  const sourceOutput = `var simpleApp = () => { };

export default simpleApp;`;

  it("should add an banner", async () => {
    const plugins = [{
      banner: () => "// banner"
    }];

    const expected = `
// banner
${sourceOutput}
`;

    const bundle = await createRollup(true, plugins);
    const code = await saveAndDiscardBundle(bundle);

    assert.equal(code, expected);
  });

  it("should handle promises", async () => {
    const plugins = [
      {
        banner: () => Promise.resolve("// banner")
      }
    ];

    const expected = `
// banner
${sourceOutput}
`;

    const bundle = await createRollup(true, plugins);
    const code = await saveAndDiscardBundle(bundle);

    assert.equal(code, expected);
  });

  it("should add an banner for every plugin", async () => {
    const plugins = [
      {
        banner: () => Promise.resolve("// banner1")
      },
      {
        banner () {}
      },
      {
        banner: () => "// banner2"
      },
      {
        banner: () => new Promise(resolve => setTimeout(() => resolve("// banner3"), 10))
      }
    ];

    const expected = `
// banner1
// banner2
// banner3
${sourceOutput}
`;

    const bundle = await createRollup(true, plugins);
    const code = await saveAndDiscardBundle(bundle);

    assert.equal(code, expected);
  });

  it("should only be included once", async () => {
    const plugins = [{
      banner: () => "// banner"
    }];

    const expected = `
// banner
var method = () => { };

method();
`;

    const bundle = await createRollup(true, plugins, "test/fixtures/importApp.js");
    const code = await saveAndDiscardBundle(bundle);

    assert.equal(code, expected);
  });
});
