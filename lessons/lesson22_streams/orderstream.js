const fs = require('fs')
const rx = require('rxjs')

const processFile = (filename) => rx.Observable.create((observer) => {
  fs.readFile(filename, (err, contents) => {
    if (err) {
      observer(err)
    } else {
      contents.toString().split('\n').forEach((line) => {
        observer.next(line)
      })
    }
  })
})

module.exports = processFile
