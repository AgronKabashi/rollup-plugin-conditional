import assert from "assert";
import sinon from "sinon";
import { compareRollupResults } from "./utilities";

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
      await compareRollupResults(plugins);
    }
    catch (err) { } // eslint-disable-line no-empty

    assert(plugins.every(plugin => plugin.renderError.calledOnce));
  });
});
