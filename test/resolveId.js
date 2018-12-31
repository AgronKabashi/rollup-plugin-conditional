import path from "path";
import { compareRollupResults } from "./utilities";

describe("resolveId", () => {
  const resolvedPath = path.resolve(__dirname, "fixtures/resolvedFileContents.js");

  it("should call resolveId", async () => {
    const plugins = [
      {
        resolveId: () => resolvedPath
      }
    ];

    await compareRollupResults(plugins);
  });

  it("should only use the first resolveId-method that returns a truthy value", async () => {
    const plugins = [
      {
        resolveId: () => {}
      },
      {
        resolveId: () => resolvedPath
      },
      {
        resolveId: () => "some/path"
      },
      {
        resolveId: () => null
      }
    ];

    await compareRollupResults(plugins);
  });

  it("should handle promises", async () => {
    const plugins = [{
      resolveId: () => Promise.resolve(resolvedPath)
    }];

    await compareRollupResults(plugins);
  });

  it("should handle a mix of promises and values", async () => {
    const plugins = [
      {
        resolveId: () => new Promise(resolve => resolve(resolvedPath))
      },
      {
        resolveId: () => Promise.resolve("// resolved 1")
      },
      {
        resolveId: () => "// resolved 2"
      }
    ];

    await compareRollupResults(plugins);
  });
});
