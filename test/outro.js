import { compareRollupResults } from "./utilities";

describe("outro", () => {
  it("should add an outro", async () => {
    const plugins = [{
      outro: () => "// Outro"
    }];

    await compareRollupResults(plugins);
  });

  it("should handle promises", async () => {
    const plugins = [
      {
        outro: () => Promise.resolve("// Outro")
      }
    ];

    await compareRollupResults(plugins);
  });

  it("should add an outro for every plugin", async () => {
    const plugins = [
      {
        outro: () => Promise.resolve("// Outro1")
      },
      {
        outro () {}
      },
      {
        outro: () => new Promise(resolve => setTimeout(() => resolve("// Outro2"), 10))
      },
      {
        outro: () => "// Outro3"
      }
    ];

    await compareRollupResults(plugins);
  });
});
