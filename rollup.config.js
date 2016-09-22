const packageJson = require("./package.json");

export default {
  entry: "src/index.js",
  targets: [
    {
      dest: packageJson.main,
      format: "cjs"
    },
    {
      dest: packageJson["jsnext:main"],
      format: "es"
    }
  ]
};