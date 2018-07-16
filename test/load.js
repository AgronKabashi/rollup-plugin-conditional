import assert from "assert";
import { createRollup } from "./utilities/createRollupConfig";

describe("load", () => {
  it("should call load", async () => {
    const plugins = [
      {
        load () {
          return "// Load";
        }
      }
    ];

    const args = await createRollup(true, plugins);

    assert.equal(args.modules[0].code, plugins[0].load());
  });

  it("should only use the last load-method that returns a truthy value", async () => {
    const expected = "// Load 2";

    const plugins = [
      {
        load: () => {}
      },
      {
        load: () => "// Load"
      },
      {
        load: () => expected
      },
      {
        load: () => null
      }
    ];

    const args = await createRollup(true, plugins);
    assert.equal(args.modules[0].code, expected);
  });

  it("should handle promises", async () => {
    const expected = "// Load";

    const plugins = [{
      load: () => Promise.resolve(expected)
    }];

    const args = await createRollup(true, plugins);
    assert.equal(args.modules[0].code, expected);
  });

  it("should handle a mix of promises and values", async () => {
    const expected = "// Load";

    const plugins = [
      {
        load: () => "// Load 1"
      },
      {
        load: () => Promise.resolve("// Load 2")
      },
      {
        load: () => new Promise(resolve => resolve(expected))
      }
    ];

    const args = await createRollup(true, plugins);
    assert.equal(args.modules[0].code, expected);
  });
});
