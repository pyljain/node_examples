module.exports = handleGet
const fs = require('fs')

function handleGet(socket, bookid) {
  fs.readFile('./books.json', (err, booksinfile) => {
    if (err) {
      console.log('Error occuered in reading books JSON')
    } else {
      //Retrieve requested book details
      const booksinfile_JSON = JSON.parse(booksinfile)
      var reequested_book = booksinfile_JSON.book[bookid].name
      console.log('Requested Book Name is', reequested_book)

      socket.end(`HTTP/1.x 200 OK
                  Connection : Close

                  ${reequested_book}`)
    }
  })
}
