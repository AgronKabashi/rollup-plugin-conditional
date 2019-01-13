import assert from "assert";
import fs from "fs";
import path from "path";
import sinon from "sinon";
import { createRollupWithConditional, createRollup } from "./utilities";
import conditional from "index";

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
        options: () => undefined
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
      },
      {
        options: () => null
      }
    ];

    const args = await createRollupWithConditional(true, plugins);

    assert.equal(args.cache.modules[0].code, resolvedContent);
  });

  it("runs non-conditional options only once", async () => {
    const conditionalSpy = sinon.spy();
    const externalOptionSpy = sinon.spy();
    const plugins = [
      {
        options: externalOptionSpy
      },
      conditional(true, [
        {
          options: conditionalSpy
        }
      ])
    ];

    await createRollup(plugins);

    assert(externalOptionSpy.calledOnce);
  });
});
