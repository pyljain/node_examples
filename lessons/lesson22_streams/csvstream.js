const fs = require('fs')
const rx = require('rxjs')

//Type signature outstanding

const csvStream = (filename) => rx.Observable.create((observer) => {
  fs.readFile(filename, (err, contents) => {
    if (err) {
      observer.error(err)
    } else {
      contents.toString().split('\n').forEach((line) => {
          observer.next(line)
      })
    }
  })
})

module.exports = csvStream
