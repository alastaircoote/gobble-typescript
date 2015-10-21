# gobble-typescript

Compile TypeScript files with gobble and [TypeScript](https://github.com/Microsoft/TypeScript).

## Installation

First, you need to have gobble installed - see the [gobble readme](https://github.com/gobblejs/gobble) for details. Then,

```bash
npm i -D gobble-typescript
```

## Usage

```js
var gobble = require( 'gobble' );
var ts = require( 'typescript' );

module.exports = gobble( 'src' ).transform( 'typescript', { 
  noImplicitAny: false,
  sourceMap: false,
  declaration: false,
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
  removeComments: true,
  jsx: ts.JsxEmit.React,
  typescript: ts, 
  listFiles: true
});
```


## License

MIT. Copyright 2015 Kevin Thompson
