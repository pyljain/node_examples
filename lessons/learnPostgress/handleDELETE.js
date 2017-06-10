module.exports = handleDELETE
const query = require('./postgresclient')

function handleDELETE(socket, client, bookid) {

  query(`DELETE FROM BOOKS WHERE ID = ${bookid}`, (result) => {
    console.log('******THE RESULT IS*******',result)
    console.log('***** IN DElEtE******')

    var result_to_return = '{"DELETED", "DONE"}'

    socket.end(`HTTP/1.1 201 CREATED
                Connection: Close
                Content-Type: application/json
                Content-Length: ${result_to_return.length}

                ${result_to_return}`
              )
  })

}
