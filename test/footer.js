import { compareRollupResults } from "./utilities";

describe("footer", () => {
  it("should add an footer", async () => {
    const plugins = [{
      footer: () => "// footer"
    }];

    await compareRollupResults(plugins);
  });

  it("should handle promises", async () => {
    const plugins = [
      {
        footer: () => Promise.resolve("// footer")
      }
    ];

    await compareRollupResults(plugins);
  });

  it("should add an footer for every plugin", async () => {
    const plugins = [
      {
        footer: () => Promise.resolve("// footer1")
      },
      {
        footer () {}
      },
      {
        footer: () => new Promise(resolve => setTimeout(() => resolve("// footer2"), 10))
      },
      {
        footer: () => "// footer3"
      }
    ];

    await compareRollupResults(plugins);
  });

  it("should only be included once", async () => {
    const plugins = [{
      footer: () => "// footer"
    }];

    await compareRollupResults(plugins, "test/fixtures/importApp.js");
  });
});
