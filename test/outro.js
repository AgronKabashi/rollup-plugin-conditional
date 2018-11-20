import assert from "assert";
import { createRollup } from "./utilities/createRollupConfig";
import { saveAndDiscardBundle } from "./utilities/saveAndDiscardBundle";

describe("outro", () => {
  const sourceOutput = `var simpleApp = () => { };

export default simpleApp;`;

  it("should add an outro", async () => {
    const plugins = [{
      outro: () => "// Outro"
    }];

    const expected = `${sourceOutput}




// Outro
`;

    const bundle = await createRollup(true, plugins);
    const code = await saveAndDiscardBundle(bundle);

    assert.equal(code, expected);
  });

  it("should handle promises", async () => {
    const plugins = [
      {
        outro: () => Promise.resolve("// Outro")
      }
    ];

    const expected = `${sourceOutput}




// Outro
`;

    const bundle = await createRollup(true, plugins);
    const code = await saveAndDiscardBundle(bundle);

    assert.equal(code, expected);
  });

  it("should add an outro for every plugin", async () => {
    const plugins = [
      {
        outro: () => Promise.resolve("// Outro1")
      },
      {
        outro () {}
      },
      {
        outro: () => "// Outro2"
      },
      {
        outro: () => new Promise(resolve => setTimeout(() => resolve("// Outro3"), 10))
      }
    ];

    const expected = `${sourceOutput}




// Outro1
// Outro2
// Outro3
`;

    const bundle = await createRollup(true, plugins);
    const code = await saveAndDiscardBundle(bundle);

    assert.equal(code, expected);
  });
});
