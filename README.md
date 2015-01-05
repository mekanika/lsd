
# lsd

> A small, modular utility belt - `left shift dash` _

## API

- .is.<Type>( value )
- .clone( element )
- .filter( collection, selector, onlyIndex )
- .match( collection, matchCondition )
- .merge( intoObj, fromObj )
- .sortBy( collection, field, isReverse )
- .toObj( key, value )

## Usage

Include the entire `lsd` belt in your code:

```js
var lsd = require('mekanika-lsd');
```

Or only load the modules you need:

```js
var merge = require('mekanika-lsd/merge');
var filter = require('mekanika-lsd/filter');
```

## License

(The MIT license)

Copyright 2014-2015 Clint Walker
