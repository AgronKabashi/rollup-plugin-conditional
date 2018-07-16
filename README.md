# rollup-plugin-conditonal
A proxy plugin for conditionally executing rollup plugins.

## Why
There are times when you only want to run a plugin if certain conditions are met. This plugin aims to simplify that setup.

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

It's also possible to nest conditionals but the recommendation is to keep the plugins as flat as possible:
```js
export default {
  ...
  plugins: [
    conditional(!isProduction, [
      conditional(isLocalBuild, [
        eslint()
      ]),
      watch()
    ])
  ]
};
```

## Versioning
This project uses semantic versioning

## License
MIT
