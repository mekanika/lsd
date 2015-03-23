
# lsd

> A small, modular utility belt

`lsd` is a repository of utility components that can be _individually_ loaded as needed to provide for very specific functionality. 


## Install

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


## API

- **.is.$Type**( item ) - type checker
- **.clone**( item ) - deep object and array cloning
- **.filter**( collection, selector, onlyIndex ) - filter from collection
- **.match**( collection, matchCondition ) - MongoDB style collection matching
- **.merge**( intoObj, fromObj ) - combine elements by merge strategy
- **.sortBy**( collection, field, isReverse ) - collection sorting
- **.toObj**( key, value ) - shorthand object creation from `key`, `value`



## License

Copyright 2014-2015 Mekanika

Released under the **MIT License** ([MIT](http://opensource.org/licenses/MIT))
