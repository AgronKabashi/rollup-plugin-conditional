import fs from "fs";
import path from "path";

export async function saveAndDiscardBundle (bundle) {
  const file = path.resolve(__dirname, "./output.js");
  const result = await bundle.write({
    file,
    format: "es"
  });

  fs.unlinkSync(file);

  return result.code;
}
