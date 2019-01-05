import assert from "assert";
import sinon from "sinon";
import { compareRollupResults } from "./utilities";

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

    await compareRollupResults(plugins);
    assert(plugins.every(plugin => plugin.renderStart.calledTwice));
  });
});
