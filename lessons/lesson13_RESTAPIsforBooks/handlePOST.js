module.exports = handlePOST
const fs = require('fs')

function handlePOST(socket, data) {
  console.log('****** DATA PASSED IN POST*****', data.toString())

  fs.readFile('./books.json', (err, booksinfile) => {
    if(err) {
      console.log('Could not get books from file', err)
    } else {
      var book_to_create = data.toString().match(/\r?\n\r?\n[\S\s\r\n]*/gm)
      //The regular expression is matching till a double enter
      //and is including all spaces,returns, newlines in between
      //till the end which is indicated with *
      const book_to_create_JSON = JSON.parse(book_to_create[0])
      var booksinfile_JSON = JSON.parse(booksinfile)

      //Check if book exists

      var found = false

      booksinfile_JSON.book.forEach((entry) => {
        if(entry.name == book_to_create_JSON["name"]) {
          found = true
        }
      })
      console.log('Found is', found)
      if (!found) {
        booksinfile_JSON.book.push(book_to_create_JSON)
      }

      fs.writeFile('./books.json', JSON.stringify(booksinfile_JSON), () =>
      console.log('******Books list updated successfully*****'))
    }
  })

  var response = '{ "TEST": "XYZ" }';

  socket.end(
  `HTTP/1.1 201 CREATED
  Content-Length: ${response.length}
  Content-Type: application/json

  ${response}`
  )

}
