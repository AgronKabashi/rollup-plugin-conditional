export function simple () {
  return {
    name: "simple",
    load: () => null
  };
}

export function transform (transformId = "") {
  return {
    name: "transform",
    load: () => null,
    transform: source => `// ${transformId} begin\n${source}\n// ${transformId} end`
  };
}

export function emptyTransform () {
  return {
    name: "emptyTransform",
    transform () { }
  };
}

export function promisifiedTransform (transformId = "") {
  return {
    name: "promisifiedTransform",
    transform: source => new Promise(resolve =>
      setTimeout(() => resolve(`// ${transformId} begin\n${source}\n// ${transformId} end`), 10)
    )
  };
}

export function transformChunk (id) {
  return {
    name: "transformChunk",
    transformChunk (code) {
      return {
        code: `${code}\ntransformChunk${id}`
      };
    }
  };
}

export function transformBundle (id) {
  return {
    name: "transformBundle",
    transformBundle (code) {
      return {
        code: `${code}\ntransformBundle${id}`
      };
    }
  };
}
