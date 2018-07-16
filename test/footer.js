import assert from "assert";
import { createRollup } from "./utilities/createRollupConfig";
import { saveAndDiscardBundle } from "./utilities/saveAndDiscardBundle";

describe("footer", () => {
  const sourceOutput = `var simpleApp = () => { };

export default simpleApp;`;

  it("should add an footer", async () => {
    const plugins = [{
      footer: () => "// footer"
    }];

    const expected = `${sourceOutput}

// footer
`;

    const bundle = await createRollup(true, plugins);
    const code = await saveAndDiscardBundle(bundle);

    assert.equal(code, expected);
  });

  it("should handle promises", async () => {
    const plugins = [
      {
        footer: () => Promise.resolve("// footer")
      }
    ];

    const expected = `${sourceOutput}

// footer
`;

    const bundle = await createRollup(true, plugins);
    const code = await saveAndDiscardBundle(bundle);

    assert.equal(code, expected);
  });

  it("should add an footer for every plugin", async () => {
    const plugins = [
      {
        footer: () => Promise.resolve("// footer1")
      },
      {
        footer () {}
      },
      {
        footer: () => "// footer2"
      },
      {
        footer: () => new Promise(resolve => setTimeout(() => resolve("// footer3"), 10))
      }
    ];

    const expected = `${sourceOutput}

// footer1
// footer2
// footer3
`;

    const bundle = await createRollup(true, plugins);
    const code = await saveAndDiscardBundle(bundle);

    assert.equal(code, expected);
  });

  it("should only be included once", async () => {
    const plugins = [{
      footer: () => "// footer"
    }];

    const expected = `var method = () => { };

method();

// footer
`;

    const bundle = await createRollup(true, plugins, "test/fixtures/importApp.js");
    const code = await saveAndDiscardBundle(bundle);

    assert.equal(code, expected);
  });
});
