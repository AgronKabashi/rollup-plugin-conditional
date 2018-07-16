import assert from "assert";
import fs from "fs";
import path from "path";
import { createRollup } from "./utilities/createRollupConfig";

describe("resolveId", () => {
  const resolvedPath = path.resolve(__dirname, "fixtures/resolvedFileContents.js");
  const resolvedContent = fs.readFileSync(resolvedPath);

  it("should call resolveId", async () => {
    const plugins = [
      {
        resolveId: () => resolvedPath
      }
    ];

    const args = await createRollup(true, plugins);

    assert.equal(args.modules[0].code, resolvedContent);
  });

  it("should only use the last resolveId-method that returns a truthy value", async () => {
    const plugins = [
      {
        resolveId: () => {}
      },
      {
        resolveId: () => "some/path"
      },
      {
        resolveId: () => resolvedPath
      },
      {
        resolveId: () => null
      }
    ];

    const args = await createRollup(true, plugins);

    assert.equal(args.modules[0].code, resolvedContent);
  });

  it("should handle promises", async () => {
    const plugins = [
      {
        resolveId: () => Promise.resolve(resolvedPath)
      }
    ];

    const args = await createRollup(true, plugins);

    assert.equal(args.modules[0].code, resolvedContent);
  });

  it("should handle a mix of promises and values", async () => {
    const plugins = [
      {
        resolveId: () => "// resolved 1"
      },
      {
        resolveId: () => Promise.resolve("// resolved 2")
      },
      {
        resolveId: () => new Promise(resolve => resolve(resolvedPath))
      }
    ];

    const args = await createRollup(true, plugins);

    assert.equal(args.modules[0].code, resolvedContent);
  });
});
