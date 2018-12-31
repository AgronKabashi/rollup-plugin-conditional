import assert from "assert";
import fs from "fs";
import path from "path";
import { createRollupWithConditional } from "./utilities";

describe("options", () => {
  const resolvedPath = path.resolve(__dirname, "fixtures/resolvedFileContents.js");
  const resolvedContent = fs.readFileSync(resolvedPath);

  it("replaces input file", async () => {
    const plugins = [
      {
        options: input => ({
          ...input,
          input: resolvedPath
        })
      }
    ];

    const args = await createRollupWithConditional(true, plugins);

    assert.equal(args.cache.modules[0].code, resolvedContent);
  });

  it("should merge options of all plugins", async () => {
    const plugins = [
      {
        options: input => ({
          ...input,
          input: "nonexisting file"
        })
      },
      {
        options: input => ({
          ...input,
          input: "nonexisting file"
        })
      },
      {
        options: input => ({
          ...input,
          input: resolvedPath
        })
      }
    ];

    const args = await createRollupWithConditional(true, plugins);

    assert.equal(args.cache.modules[0].code, resolvedContent);
  });
});
