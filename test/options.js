import assert from "assert";
import fs from "fs";
import path from "path";
import { createRollup } from "./utilities/createRollupConfig";

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

    const args = await createRollup(true, plugins);

    assert.equal(args.modules[0].code, resolvedContent);
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

    const args = await createRollup(true, plugins);

    assert.equal(args.modules[0].code, resolvedContent);
  });
});
