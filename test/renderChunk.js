import { compareRollupResults } from "./utilities";
import * as samplePlugins from "./fixtures/samplePlugins";

describe("renderChunk", () => {
  it("transforms chunks in sequential order", async () => {
    const plugins = [
      samplePlugins.transformChunk("3"),
      samplePlugins.transformChunk("2"),
      samplePlugins.transformBundle("4"),
      samplePlugins.renderChunk("1")
    ];

    await compareRollupResults(plugins);
  });
});
