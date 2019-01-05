import assert from "assert";
import sinon from "sinon";
import { compareRollupResults } from "./utilities";

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

    await compareRollupResults(plugins);
    assert(plugins.every(plugin => plugin.buildStart.calledTwice));
  });
});
