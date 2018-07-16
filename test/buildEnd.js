import assert from "assert";
import sinon from "sinon";
import { createRollup } from "./utilities/createRollupConfig";

describe("buildEnd", () => {
  it("should call be called when build starts", async () => {
    const plugins = [
      {
        buildEnd: sinon.spy()
      },
      {
        buildEnd: sinon.spy(() => Promise.resolve())
      }
    ];

    await createRollup(true, plugins);
    assert(plugins.every(plugin => plugin.buildEnd.calledOnce));
  });
});
