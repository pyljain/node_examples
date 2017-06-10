module.exports = handlePUT
const query = require('./postgresclient')

function handlePUT(socket, client, data, bookid) {
  console.log('**** IN PUT****')

  var book_to_update = data.toString().match(/\r?\n\r?\n[\S\s\r\n]*/gm)
  var book_to_update_JSON = JSON.parse(book_to_update[0])

  const query_PUT = `UPDATE BOOKS SET
                     NAME= '${book_to_update_JSON["Name"]}',
                     AUTHOR = '${book_to_update_JSON["Author"]}'
                     WHERE ID = ${bookid}`

  console.log('CONSTRUCTED QUERY', query_PUT)

  query(query_PUT, (result) => {

    var response = '{"UPDATE", "DONE"}'

    socket.end(`HTTP/1.1 201 CREATED
                Content-Length: ${response.length})
                Content-Type: 'application/json'

                ${response}`
              )
  })
}
