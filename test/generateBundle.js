import assert from "assert";
import sinon from "sinon";
import { compareRollupResults } from "./utilities";

describe("generateBundle", () => {
  it("called when bundle is generated", async () => {
    const plugins = [
      {
        ongenerate: sinon.spy(),
        onwrite: sinon.spy(),
        generateBundle: sinon.spy()
      }
    ];

    await compareRollupResults(plugins);
    assert(plugins.every(plugin => plugin.generateBundle.calledTwice));
  });
});
