# provisor
provisor is simple JavaScript module that watch promises in specific namespace, with cancelable.

## Example
See the example.js to details.

```javascript
var provisor = require('provisor');

function doAsync() {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, 3000);
	});
}

var request1 = doAsync();
var request2 = doAsync();

provisor.addNamespace('example');

// Make sure to use that returning object from provisor.save()
request1 = provisor.save('example', 'async1', request1);
request2 = provisor.save('example', 'async2', request2);
// request2 = provisor.save('example', 'async2', request2, { timeout: 1000 });

request1
.then(() => console.log('Done!'))
.catch((err) => console.log('Error', err));

request2
.then(() => console.log('Done!'))
.catch((err) => console.log('Error', err));

// Cancel example::async2
provisor.cancel('example', 'async2');		// comment this line when you want to test timeout
```

## Usage
```bash
$ npm install --save provisor
```

```javascript
var provisor = require('provisor');

...

// PROFIT!!!
```


## Important
This module not actually cancel the promise because it's not possible. So when you do some async job, and it ends after you cancel the promise, previous async job is still completed, but not it will not resolve the promise, because it's already did.

If you run the example, I canceled all promises, so the promise flow immediately ends, but timer is still going on, and process ends when timer is done.

Most of situations, it should be fine, especially in Web Development, but some cases, it could be a problem. So make sure that your situation is suitable for using this or not.


## API
### Object provisor
Returns provisor.


### Object provisor.namespace
Returns all namespace. Namespace is just simple object.


### void provisor.addNamespace(String namespace)
Add new namespace.


### void provisor.removeNamespace(String namespace)
Remove specified namespace. It will throw exception if namespace wasn't exists.


### Boolean provisor.hasNamespace(String namespace)
Returns true if specified namespace exists.


### Promise provisor.save(String namespace, String key, Promise promise, Object options)
Save passed promise into specified namespace::key. You can access saved promise as "provisor.namespace.key".
It returns new promise object that continue promise.

This method will remove promise from namespace::key automatically when it's done.


### void provisor.cancel(String namespace, String key)
Forcely cancel specified namespace::key promise. Note that if you are using Fetch, using this just change the promise flow, not actually cancel XHR, it's limitation of Fetch API.


### void provisor.cancelAll(String namespace)
Forcely cancel all promises in specified namespace.


### Object provisor.use(String namespace)
Returns new object that has same functions as provisor, but every namespace argument is binded automatically.

```javascript
provisor.addNamespace('space1');
var iProvisor = provisor.use('space1');

var request = doAsync();

iProvisor.save('key1', request);	// You can now skip namespace!
iProvisor.cancel('key1');
```


## License
MIT. Free to use.