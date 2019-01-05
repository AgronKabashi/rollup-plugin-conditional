import { compareRollupResults } from "./utilities";

describe("intro", () => {
  it("should add an intro", async () => {
    const plugins = [{
      intro: () => "// Intro"
    }];

    await compareRollupResults(plugins);
  });

  it("should handle promises", async () => {
    const plugins = [
      {
        intro: () => Promise.resolve("// Intro")
      }
    ];

    await compareRollupResults(plugins);
  });

  it("should add an intro for every plugin", async () => {
    const plugins = [
      {
        intro: () => Promise.resolve("// Intro1")
      },
      {
        intro () {}
      },
      {
        intro: () => new Promise(resolve => setTimeout(() => resolve("// Intro2"), 10))
      },
      {
        intro: () => "// Intro3"
      }
    ];

    await compareRollupResults(plugins, "test/fixtures/importApp.js");
  });
});
