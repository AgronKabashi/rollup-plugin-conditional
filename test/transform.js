import assert from "assert";
import fs from "fs";
import path from "path";
import { createRollup } from "./utilities/createRollupConfig";
import * as samplePlugins from "./fixtures/samplePlugins";

describe("transform", () => {
  let plugins;
  const sourceFileContent = fs.readFileSync(path.resolve(__dirname, "fixtures/simpleApp.js"));

  beforeEach(() => {
    plugins = [
      samplePlugins.transform("transform1"),
      samplePlugins.emptyTransform(),
      samplePlugins.transform("transform2")
    ];
  });

  it("transforms the code in sequential order", async () => {
    const args = await createRollup(true, plugins);
    const expected = `// transform2 begin
// transform1 begin
${sourceFileContent}
// transform1 end
// transform2 end`;
    assert.equal(args.modules[0].code, expected);
  });

  it("transforms the code in sequential order using promises", async () => {
    const args = await createRollup(true, [
      samplePlugins.promisifiedTransform("transform1"),
      samplePlugins.transform("transform2"),
      samplePlugins.promisifiedTransform("transform3")
    ]);
    const expected = `// transform3 begin
// transform2 begin
// transform1 begin
${sourceFileContent}
// transform1 end
// transform2 end
// transform3 end`;
    assert.equal(args.modules[0].code, expected);
  });
});
