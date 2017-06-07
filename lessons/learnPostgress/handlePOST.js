module.exports = handlePOST
const pg = require('pg')
const query = require('./postgresclient')

function handlePOST(socket, client, data) {
  console.log('Data passed in POST', data.toString())

  var book_to_insert = data.toString().match(/\r?\n\r?\n[\S\s\r\n]*/gm)

  var book_to_insert_JSON = JSON.parse(book_to_insert[0])

  query(`INSERT INTO BOOKS VALUES
         ( ${book_to_insert_JSON["Id"]},
           '${book_to_insert_JSON["Name"]}',
           '${book_to_insert_JSON["Author"]}')`, (result) => {

             console.log('****INSERT RESULT IS****', result)
             var response = '{"INSERTED", "DONE"}'

             socket.end(
               `HTTP/1.1 201 CREATED
                Content-Length: ${response.length}
                Content-Type: application/json

                ${response}`
             )
           }
         )
}
