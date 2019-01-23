# rollup-plugin-conditional
A proxy plugin for conditionally executing rollup plugins.
<br>
<strong>NOTE:</strong> This plugin has entered maintenance only mode, meaning that only bugs will be fixed. See **`But do I really need it`** section to accomplish the same thing without a plugin.

## Why
There are times when you only want to run a plugin if certain conditions are met. This plugin aims to simplify that setup.

## But do I really need it?
Not really, in relatively newer versions on rollup you can accomplish the same thing using a simple spread mechanic:

```js
export default {
  ...
  plugins: [
    ...isProduction ? [
      licence(),
      strip(),
      uglify(),
      gzip()
    ] : []
  ]
};
```

In the end, this syntax is better because:
* It reduces the cost of overhead and increases performance slightly
* It reduces your dependencies by one

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
      filesize()
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

### Special cases
Unfortunately some plugins, like rollup-plugin-serve, always assume that they will be executed so they perform some premature tasks before any of the life cycle hooks are called:

```js
import serve from "rollup-plugin-serve";

export default {
  ...
  plugins: [
    conditional(false, [ // false here will prevent any of the plugins' life cycle hooks from being executed
      // rollup-plugin-serve will however instantiate a http(s)-server immediately and outside any of the life cycle hooks
      // resulting in the http-server running even though we don't want it to.
      serve()
    ])
  ]
};
```

In order to work around this we need to defer the initialisation by simply providing a callback method that returns the plugins:

```js
import serve from "rollup-plugin-serve";

export default {
  ...
  plugins: [
    conditional(false, () => [ // Notice the arrow function.
      serve()
    ])
  ]
};
```

## Backwards Compatibility Table

| Rollup Version  | Plugin Version            |
|-----------------|---------------------------|
| 0.57+           | 3.x *(Recommended)*       |
| 0.62 - 0.68.2   | 2.x                       |
| < 62            | 1.x                       |


## Versioning
This project uses semantic versioning
