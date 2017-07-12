const rx = require('rxjs')

//Scan gives you an output after every stream output whereas reduce waits for
//the stream to end. Reduce and scan both take a callback as input and optionally
//an initial value

// rx.Observable.interval(1000)
//   .take(5)
//   .scan((acc,value) => acc.concat(value), [])
// //  .reduce((acc, value) => acc.concat(value), [])
//   .subscribe(x => console.log(x))




const randomStream =
  rx.Observable.interval(1000)
    .take(7)
    .map(_ => Math.floor(Math.random() * 20))


//randomStream.subscribe(x => console.log('Number is', x))

var testStream =
  randomStream
    .map(x => {
      console.log(x)
      return x
    })
    .reduce((acc,value) =>  acc > value ? acc : value, 0 )
    .subscribe(x => console.log('Largest is', x))
