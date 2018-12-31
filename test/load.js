import { compareRollupResults } from "./utilities";

describe("load", () => {
  it("should call load", async () => {
    const plugins = [
      {
        load () {
          return "// Load";
        }
      }
    ];

    await compareRollupResults(plugins);
  });

  it("should only use the first load-method that returns a truthy value", async () => {
    const plugins = [
      {
        load: () => {}
      },
      {
        load: () => "// Load1"
      },
      {
        load: () => "// Load2"
      },
      {
        load: () => null
      }
    ];

    await compareRollupResults(plugins);
  });

  it("should handle promises", async () => {
    const plugins = [{
      load: () => Promise.resolve("// Load")
    }];

    await compareRollupResults(plugins);
  });

  it("should handle a mix of promises and values", async () => {
    const plugins = [
      {
        load: () => "// Load 1"
      },
      {
        load: () => Promise.resolve("// Load 2")
      },
      {
        load: () => new Promise(resolve => resolve("// Load 3"))
      }
    ];

    await compareRollupResults(plugins);
  });
});
