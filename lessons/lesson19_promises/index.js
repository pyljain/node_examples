const promisefs = require('./promisefs')

promisefs.read('./readsample.txt')()
  .then(promisefs.write('./writesample.txt'))
//  .then(() => console.log('File contents', contents.toString()))
  .then(() => console.log('Read & Write complete'))
  .catch()

//Remember that then takes a FUNCTION that
//returns a promise

/* NOTES
.then is a property of the object of type Promise.
So, for .then to be used, the strating funciton / point
needs to be one that returns a promise or is a promise. Hence
the first line here is promisefs.read('./readsample.txt')()
as that resolves in a promise.

.then however then takes as input a function that returns a promise.
This ensures that .thens are able to be chained
*/
