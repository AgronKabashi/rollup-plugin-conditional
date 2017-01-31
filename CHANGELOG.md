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