module.exports = handlePATCH
const pg = require('pg')
const query = require('./postgresclient')

function handlePATCH(socket, client, data, bookid) {
  console.log('****** IN PATCH *******', data.toString())

  var book_to_update = data.toString().match(/\r?\n\r?\n[\S\s\r\n]*/gm)
  var book_to_update_JSON = JSON.parse(book_to_update[0])
  console.log('JSON', JSON.parse(book_to_update[0]))
  console.log('Name in JSON',book_to_update_JSON["Name"])

  // var construct_query = 'UPDATE BOOKS SET NAME = '+`'${"name" in book_to_update_JSON ? NAME : book_to_update_JSON["Name"]}',
  //        AUTHOR = '${book_to_update_JSON["Author"]=='undefined'? AUTHOR : book_to_update_JSON["Author"]}'`+ ` where ID = ${bookid}`

  var construct_query = `UPDATE BOOKS SET
         ${"Name" in book_to_update_JSON ? "NAME = '" + book_to_update_JSON["Name"] + "'," : '' }
         ${"Author" in book_to_update_JSON ? "AUTHOR = '" + book_to_update_JSON["Author"] + "'," : '' }
         ID = ${bookid}
         WHERE ID = ${bookid}`

  console.log('***CONSTRUCTED QUERY',construct_query)


  query(construct_query, (result) => {
           console.log('RESULT IS', result)

           var response = '{"UPDATE" : "COMPLETED"}'

           socket.end(`HTTP/1.1 201 CREATED
                       Content-Length: ${response.length}
                       Content-Type: application/json

                       ${response}`
                     )
         }
       )
}
