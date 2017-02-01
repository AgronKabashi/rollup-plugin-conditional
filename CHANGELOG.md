# Version 1.1.0
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

# Version 1.0.1
* Minor hotpatch that updates the build files

# Version 1.0.0
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