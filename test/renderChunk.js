import { compareRollupResults } from "./utilities";
import * as samplePlugins from "./fixtures/samplePlugins";

describe("renderChunk", () => {
  it("transforms chunks in sequential order", async () => {
    const plugins = [
      samplePlugins.renderChunk("1"),
      samplePlugins.transformChunk("2"),
      samplePlugins.transformChunk("3"),
      samplePlugins.transformBundle("4")
    ];

    await compareRollupResults(plugins);
  });
});
