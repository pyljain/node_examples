
const rx = require('rxjs')
const pg = require('pg')

const connect = (connectionObj) => rx.Observable.create((observer) => {
  const client = new pg.Client(connectionObj)
  client.connect((err) => {
    if (err) {
      observer.error(err)
    } else {
      observer.next(client)
    }
  })
})

const query = (conn, query) => rx.Observable.create((observer) => {
  conn.query(query, (err, result) => {
    if (err) {
      observer.error(err)
    } else {
      if(result.rows) {
        result.rows.forEach((row) => observer.next(row))
      }
    }
  })
})

module.exports = {
  connect,
  query
}
