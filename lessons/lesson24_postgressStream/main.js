const rx = require('rxjs')
const pgStream = require('./pgstream')
const CONSTANTS = require('./constants')
const sfstream = require('./sfstream')


const stream1 = pgStream.connect(CONSTANTS.CLIENT)
  .flatMap(conn => pgStream.query(conn, CONSTANTS.QUERY))
//  .subscribe(row => console.log(row))

const stream2 = sfstream.connect(CONSTANTS.BASEURL, CONSTANTS.USERNAME, CONSTANTS.KEY, CONSTANTS.CONSUMERKEY)
  .flatMap(connection =>
    stream1
      .map(row => [connection, row])
  )
  .flatMap(obj => sfstream.insert(obj[0], 'Account', obj[1]))
  .subscribe(combined => console.log(combined))



















// Array.prototype.flatMap = function(lambda) {
//     return Array.prototype.concat.apply([], this.map(lambda));
// };
//
// const query = (conn) => ['row1', 'row2', 'row3']
//
// const stream1 = ['conn1', 'conn2', 'conn3'].flatMap(conn => query(conn))
//
// console.log(stream1)
