import assert from "assert";
import sinon from "sinon";
import { createRollup } from "./utilities/createRollupConfig";

describe("buildStart", () => {
  it("should be called when build starts", async () => {
    const plugins = [
      {
        buildStart: sinon.spy()
      },
      {
        buildStart: sinon.spy(() => Promise.resolve())
      }
    ];

    await createRollup(true, plugins);
    assert(plugins.every(plugin => plugin.buildStart.calledOnce));
  });
});
