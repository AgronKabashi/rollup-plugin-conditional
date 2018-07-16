import packageJson from "./package.json";

export default {
  input: "src/conditional.js",
  output: {
    file: packageJson.main,
    format: "cjs"
  }
};
