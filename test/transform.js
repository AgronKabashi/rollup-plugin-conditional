import { compareRollupResults } from "./utilities";
import * as samplePlugins from "./fixtures/samplePlugins";

describe("transform", () => {
  it("transforms the code in sequential order", async () => {
    const plugins = [
      samplePlugins.transform("transform1"),
      samplePlugins.emptyTransform(),
      samplePlugins.transform("transform2")
    ];

    await compareRollupResults(plugins);
  });

  it("transforms the code in sequential order using promises", async () => {
    const plugins = [
      samplePlugins.promisifiedTransform("transform1"),
      samplePlugins.transform("transform2"),
      samplePlugins.promisifiedTransform("transform3")
    ];

    await compareRollupResults(plugins);
  });
});
