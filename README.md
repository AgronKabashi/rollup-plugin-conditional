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
import conditional from "rollup-plugin-conditional";
// import other plugins

const isProduction = process.env.buildTarget === "PROD";

export default {
  ...
  plugins: [
    ...
    conditional(isProduction, [
      licence(),
      strip(),
      uglify(),
      gzip()
    ]),

    conditional(!isProduction, [
      filesize(),
      watch()
    ])
  ]
})
```

## Versioning
This project uses semantic versioning

## License
MIT