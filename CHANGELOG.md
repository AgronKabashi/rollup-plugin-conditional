# Changelog

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
