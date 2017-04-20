var provisor = require('./index');

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
// provisor.cancel('example', 'async2');		// comment this line when you want to test timeout
provisor.cancelAll('example');