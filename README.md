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

module.exports = gobble( 'src' ).transform( 'typescript', {   
  
  // default option
  target: 'ES3',
  
  // default option
  module: 'CommonJS',
  
  // default option
  jsx: 'React', 
  
  // remaining options are passed directly to the typescript compiler 
  listFiles: true,
  noImplicitAny: false,
  sourceMap: false,
  declaration: false,
  removeComments: true
});
```


## License

MIT. Copyright 2015 Kevin Thompson
