import { compareRollupResults } from "./utilities";

describe("banner", () => {
  it("should add an banner", async () => {
    const plugins = [{
      banner: () => "// banner"
    }];

    await compareRollupResults(plugins);
  });

  it("should handle promises", async () => {
    const plugins = [{
      banner: () => Promise.resolve("// banner")
    }];

    await compareRollupResults(plugins);
  });

  it("should add an banner for every plugin", async () => {
    const plugins = [
      {
        banner: () => Promise.resolve("// banner1")
      },
      {
        banner () {}
      },
      {
        banner: () => new Promise(resolve => setTimeout(() => resolve("// banner2"), 10))
      },
      {
        banner: () => "// banner3"
      }
    ];

    await compareRollupResults(plugins);
  });

  it("should only be included once", async () => {
    const plugins = [{
      banner: () => "// banner"
    }];

    await compareRollupResults(plugins, "test/fixtures/importApp.js");
  });
});
