import assert from "assert";
import { createRollup } from "./utilities/createRollupConfig";
import * as samplePlugins from "./fixtures/samplePlugins";
import { saveAndDiscardBundle } from "./utilities/saveAndDiscardBundle";

describe("transformChunk", () => {
  let plugins;

  beforeEach(() => {
    plugins = [
      samplePlugins.transformChunk("1"),
      samplePlugins.transformBundle("2"),
      samplePlugins.transformChunk("3")
    ];
  });

  it("transforms chunks in sequential order", async () => {
    const bundle = await createRollup(true, plugins);
    const expected = `var simpleApp = () => { };

export default simpleApp;
transformChunk1
transformBundle2
transformChunk3
`;

    const code = await saveAndDiscardBundle(bundle);
    assert.equal(code, expected);
  });
});
