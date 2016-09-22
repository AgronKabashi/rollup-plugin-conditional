# rollup-plugin-conditonal
A proxy plugin for conditionally executing rollup plugins.

## Why
There are times when you only want to run a plugin if a certain condition is met. This plugin aims to simplify that setup.

## Installation

```bash
npm install rollup-plugin-conditional --save-dev
```

## Usage

```js
import uglify from "rollup-plugin-uglify";
import conditional from "rollup-plugin-conditional";

export default {
  ...
  plugins: [
    conditional({
      condition: process.env.buildTarget === "PROD",
      plugin: uglify()
    })
  ]
})
```

## License
MIT