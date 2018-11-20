import assert from "assert";
import sinon from "sinon";
import { createRollup } from "./utilities/createRollupConfig";
import { saveAndDiscardBundle } from "./utilities/saveAndDiscardBundle";

describe("renderStart", async () => {
  it("should be called every time bundle is generated", async () => {
    const plugins = [
      {
        renderStart: sinon.spy()
      },
      {
        renderStart: sinon.spy(() => Promise.resolve())
      }
    ];

    const bundle = await createRollup(true, plugins);
    await saveAndDiscardBundle(bundle);
    assert(plugins.every(plugin => plugin.renderStart.calledOnce));
  });
});
