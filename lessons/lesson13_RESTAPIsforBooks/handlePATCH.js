module.exports = handlePATCH
const fs = require('fs')

function handlePATCH(socket, data, book_id) {
console.log('******* IN PATCH*******', data.toString())

fs.readFile('./books.json', (err, booksinfile) => {
  if(err) {
    console.log('Could not get books from the file', err)
  } else {
    var booksinfile_JSON = JSON.parse(booksinfile)
    var book_to_update = data.toString().match(/\r?\n\r?\n[\S\s\r\n]*/gm)
    var book_to_update_JSON = JSON.parse(book_to_update[0])

    //Update book if it exists
    var book_found = false

    booksinfile_JSON.book.forEach((book_entry) => {
      if(book_entry.book_id == book_to_update_JSON.book_id) {
       book_entry.name = book_to_update_JSON.name
       fs.writeFile('./books.json', JSON.stringify(booksinfile_JSON), () => {
         console.log('****** BOOKS LIST UPDATED******')
       })
     } else {
       console.log('Book not found, cannot update')
     }
    //  fs.writeFile('./books.json', JSON.stringify(booksinfile_JSON), () => {
    //    console.log('****** BOOKS LIST UPDATED******')
    //  })
   })
  }
})

var response = '{"UPDATE" : "COMPLETE"}';

socket.end(`HTTP/1.1 201 CREATED
            Content-Length: ${response.length}
            Content-Type: application/json

            ${response}`
          )
}
