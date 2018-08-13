import packageJson from "./package.json";

export default {
  input: "src/index.js",
  output: {
    file: packageJson.main,
    format: "cjs"
  }
};
