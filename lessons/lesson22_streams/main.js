const rx = require('rxjs')
const csvStream = require('./csvstream')
const processCustOrdersStream = require('./orderstream')

//Rx.Observable --> is an object that has methods such as interval, timer, take,
//subscribe, map, reduce. filter, fromPromise, create etc.

//Rx.Observable.interval :: (int => Observable<A>)
//Rx.Observable<A>.subscribe :: ((A) => void) => void
//Rx.Observable<A>.map((A) => B) => Rx.Observable<B>

const stream1 = rx.Observable.interval(1000)
//   .filter(x => x%2 != 0)
//   .map(x => x*2)
//   .subscribe(x => console.log(x))


// const stream2 = csvStream('./test.csv')
//   .filter(line => line != '')
//   .map(line => line.toUpperCase())
//   .map(line => ({
//     firstname: line.split(',')[0],
//     lastname: line.split(',')[1]
//   }))
  // .subscribe(line => console.log(line)) //subscribe always returns a VOID

// stream1
// //.take(5)
//   .flatMap(counter => stream2)
//   .subscribe(output => console.log(output))


const customerStream = processCustOrdersStream('./names.csv')
  .filter(eachline => eachline != '')
  .map(eachLine => ({
    custNumber: eachLine.split(',')[0],
    custName: eachLine.split(',')[1]
  }))
//  .subscribe(eachLine => console.log(eachLine))

const orderstream = processCustOrdersStream('./orders.csv')
  .filter(entry => entry != '')
  .map(entry => ({
    customer_num: entry.split(',')[0],
    item: entry.split(',')[1]
  }))
//  .subscribe(entry => console.log(entry))


const combinedStream =
  customerStream
    .flatMap(custRow =>
      orderstream
        .filter(eachOrder => eachOrder.customer_num == custRow.custNumber)
        .map(eachOrder => ({
            custName: custRow.custName,
            item: eachOrder.item
        }))
     )

const run = () =>
  combinedStream
    .subscribe(row => console.log(row))

run()
// [{
//   "name": "Andy",
//   "item": "Toothpaste"
// },
// {
//   "name": "Andy",
//   "item": "BRUSH"
// },
// {
//   "name": "Bandy",
//   "item": "PIZZA"
// }
// ]
