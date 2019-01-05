import assert from "assert";
import sinon from "sinon";
import { compareRollupResults } from "./utilities";

describe("buildEnd", () => {
  it("should be called when build ends", async () => {
    const plugins = [
      {
        buildEnd: sinon.spy()
      },
      {
        buildEnd: sinon.spy(() => Promise.resolve())
      }
    ];

    await compareRollupResults(plugins);
    assert(plugins.every(plugin => plugin.buildEnd.calledTwice));
  });
});
