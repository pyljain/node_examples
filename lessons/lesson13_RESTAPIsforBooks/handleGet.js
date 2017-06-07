module.exports = handleGet
const fs = require('fs')

function handleGet(socket, bookid) {
  fs.readFile('./books.json', (err, booksinfile) => {
    if (err) {
      console.log('Error occuered in reading books JSON')
    } else {
      //Retrieve requested book details
      const booksinfile_JSON = JSON.parse(booksinfile)
      var reequested_book = JSON.stringify(booksinfile_JSON.book[bookid])
      console.log('Requested Book Name is', reequested_book)

      socket.end(`HTTP/1.1 200 OK
                  Connection: Close
                  Content-Type: application/json
                  Content-Length: ${reequested_book.length}

                  ${reequested_book}`)
    }
  })
}
