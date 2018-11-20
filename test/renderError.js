import assert from "assert";
import sinon from "sinon";
import { createRollup } from "./utilities/createRollupConfig";
import { saveAndDiscardBundle } from "./utilities/saveAndDiscardBundle";

describe("renderError", async () => {
  it("should be called if an error occurs when bundle is generated", async () => {
    const plugins = [
      {
        renderChunk: () => {
          throw new Error("ERROR");
        },
        renderError: sinon.spy()
      },
      {
        renderError: sinon.spy(() => Promise.resolve())
      }
    ];

    try {
      const bundle = await createRollup(true, plugins);
      await saveAndDiscardBundle(bundle);
    }
    catch (err) { } // eslint-disable-line no-empty

    assert(plugins.every(plugin => plugin.renderError.calledOnce));
  });
});
