module.exports = handleDELETE
const fs = require('fs')

function handleDELETE(socket, bookid) {
  fs.readFile('./books_newstructure.json', (err, booksinfile) => {
    if(err) {
      console.log('Unable to read books from file', err)
    } else {
      const booksinfile_JSON = JSON.parse(booksinfile)
      if( bookid in booksinfile_JSON) {
        delete booksinfile_JSON[bookid]
        fs.writeFile('./books_newstructure.json', JSON.stringify(booksinfile_JSON), () => {
          console.log('****** BOOKS LIST UPDATED******')
        })

        var response = '{"DELETE" : "COMPLETE"}';
        socket.end(`HTTP/1.1 201 CREATED
                   Content-Length: ${response.length}
                   Content-Type: application/json

                  ${response}`
                )
      }
    }
  })
}
