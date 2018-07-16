import assert from "assert";
import { createRollup } from "./utilities/createRollupConfig";
import { saveAndDiscardBundle } from "./utilities/saveAndDiscardBundle";

describe("intro", () => {
  const sourceOutput = `var simpleApp = () => { };

export default simpleApp;
`;

  it("should add an intro", async () => {
    const plugins = [{
      intro: () => "// Intro"
    }];

    const expected = `// Intro

${sourceOutput}`;

    const bundle = await createRollup(true, plugins);
    const code = await saveAndDiscardBundle(bundle);

    assert.equal(code, expected);
  });

  it("should handle promises", async () => {
    const plugins = [
      {
        intro: () => Promise.resolve("// Intro")
      }
    ];

    const expected = `// Intro

${sourceOutput}`;

    const bundle = await createRollup(true, plugins);
    const code = await saveAndDiscardBundle(bundle);

    assert.equal(code, expected);
  });

  it("should add an intro for every plugin", async () => {
    const plugins = [
      {
        intro: () => Promise.resolve("// Intro1")
      },
      {
        intro () {}
      },
      {
        intro: () => "// Intro2"
      },
      {
        intro: () => new Promise(resolve => setTimeout(() => resolve("// Intro3"), 10))
      }
    ];

    const expected = `// Intro1
// Intro2
// Intro3

${sourceOutput}`;

    const bundle = await createRollup(true, plugins);
    const code = await saveAndDiscardBundle(bundle);

    assert.equal(code, expected);
  });
});
