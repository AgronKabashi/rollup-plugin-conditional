# Changelog

## Version 3.1.2
*2019-01-23*
* Updated readme. Plugin is now in maintenance mode, only bugs will be addressed.

## Version 3.1.1
*2019-01-14*
* Decreased rollup peer-dependency version.
* Added backwards compatbility map to readme.
* Updated rollup dependency to v1.1

## Version 3.1.0
*2019-01-14*
* Rewrote internals in order remove overhead and better conform to future rollup API changes.
* Increased performance and reduced plugin size.

## Version 3.0.0
*2019-01-01*
* Compatibility with rollup v1.0. Contains several under the hood changes such as removal of deprecated options and new API hooks.
* Tests reworked to compare results against rollup itself. Should detect breaking changes much easier.

## Version 2.2.0
*2018-11-20*
* Added support for new hooks, `renderStart` and `renderError`.

## Version 2.1.1
*2018-08-13*
* Patch: API hook `transformBundle` wasn't removed as suggested by the docs and is still supported, [though deprecated](https://github.com/rollup/rollup/issues/2395). This patch adds backwards compatibility until rollup v1.0 is released. Changes will be reverted in [#4](https://github.com/AgronKabashi/rollup-plugin-conditional/issues/4).

## Version 2.1.0
*2018-07-26*
* Added support for deferred initialization of rollup plugins. Prevents plugins from causing side effects.
  - Special thanks to [chambo-e](https://github.com/chambo-e) for making it possible.

## Version 2.0.0
*2018-07-16*
* Conforms to latest rollup API (0.62). Make sure you use this version or higher.
* Properly chains `transform` and `transformChunk`. This was broken in 1.1.1 since it only processed the first occurrence.

## Version 1.1.1
*2017-02-01*
* Minor publication script fix

## Version 1.1.0
*2017-02-01*
* Simplified the syntax for initializing conditional. The older syntax is now deprecated.

```
// Before
plugins: [
  conditional({
    condition: process.env.buildTarget === "PROD",
    plugins: [
      plugin1(),
      plugin2(),
      ...
    ]
  })
]

// After
plugins: [
  conditional(process.env.buildTarget === "PROD", [
    plugin1(),
    plugin2(),
    ...
  ])
]
```

## Version 1.0.1
*2017-01-31*
* Minor hotpatch that updates the build files

## Version 1.0.0
*2017-01-31*
* `plugin` property is replaced with `plugins` to simplify the setup where you need to run many plugins based on the same condition
```
// Before
plugins: [
    conditional({
      condition: process.env.buildTarget === "PROD",
      plugin: uglify()
    }),
    conditional({
      condition: process.env.buildTarget === "PROD",
      plugin: filesize()
    })
  ]

// After
plugins: [
    conditional({
      condition: process.env.buildTarget === "PROD",
      plugins: [
        uglify(),
        filesize()
      ]
    })
  ]
```

## Version 0.1.3
*2016-09-25*
* Unit tests added

## Version 0.1.2
*2016-09-22*
* Removed mutation

## Version 0.1.1
*2016-09-22*
* Initial public release
