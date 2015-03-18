
# lsd

> A small, modular utility belt

`lsd` is a collection of utility components that can be _individually_ loaded as needed and provide for very specific functionality. 

## API

- .is.{Type}( item )
- .clone( item )
- .filter( collection, selector, onlyIndex )
- .match( collection, matchCondition )
- .merge( intoObj, fromObj )
- .sortBy( collection, field, isReverse )
- .toObj( key, value )

## Usage

For CommonJS (Node) usage, you can include the entire `lsd` belt in your code:

```js
var lsd = require('mekanika-lsd');
```

Or only load the modules you need:

```js
var merge = require('mekanika-lsd/merge');
var filter = require('mekanika-lsd/filter');
```

For **browser** usage, the entire library is provided as a build under `/build`.

```html
<script src="node_modules/mekanika-lsd/build/mekanika-lsd.min.js"></script>
```

## License

(The MIT license)

Copyright 2014-2015 Mekanika
