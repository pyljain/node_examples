const express = require('express')
const bodyparser = require('body-parser')
const pg = require('pg')
const query = require('./postgresclient')

const app = express()
app.use(bodyparser.json())
const PORT = process.env.port || 9031

app.listen(PORT, () => {
  console.log('The server is listening')
})

app.get('/book/:id', (req, res) => {
  var bookid = parseInt(req.params.id)
  const queryGET = `SELECT * FROM BOOKS WHERE ID = ${bookid}`

  query(queryGET, (result) => {
    if (result) {
     res.json(result.rows[0])
   } else {
     res.status(404).send('Not Found')
   }

  })
})

app.post('/book', (req, res) => {

  var input_book = req.body
  var book_to_insert_id = input_book.id
  console.log('Book to CREATE', book_to_insert_id)
  if (book_to_insert_id) {
    query(`SELECT ID FROM BOOKS WHERE ID = ${book_to_insert_id}`, (result) => {

      if (result.rows[0]) {
        console.log('Result of SEARCH for ID', result)
        res.status(500).send('Book already exists')
      } else {
        const bookinsertquery = `INSERT INTO BOOKS VALUES
                                (${input_book["id"]},
                                 '${input_book["name"]}',
                                 '${input_book["author"]}'
                                )`
       query(bookinsertquery, (result) => {
         res.status(201).send('Book inserted successfully')
       })
      }
    })
  } else {
    res.status(500).send('Request incorrect')
  }
})

app.put('/book/:id', (req, res) => {

  var booktoupdateID = parseInt(req.params.id)
  console.log('Book ID passed is', booktoupdateID)

  if (booktoupdateID) {
    const querytocheckwithID = `SELECT ID FROM BOOKS
                                WHERE ID = ${booktoupdateID}`
    console.log('Query to run',querytocheckwithID)
    query(querytocheckwithID, (result) => {
      console.log('Result of searching for book', result)
      if(result.rows[0]) {
        var booktoupdate = req.body
        console.log('Book to Update with body-parser', req.body)
        const updateQuery = `UPDATE BOOKS SET
                             NAME = '${booktoupdate["name"]}',
                             AUTHOR = '${booktoupdate["author"]}'
                             WHERE ID = ${booktoupdateID}`

        query(updateQuery, (result) => {
          res.status(201).send('Book Updated')
        })
      } else {
        res.status(500).send('Book does not exist')
      }
    })
  } else {
    res.status(500).send('Message received does not have book ID')
  }

})

app.patch('/book/:id', (req, res) => {
  var bookid = parseInt(req.params.id)

  if (bookid) {
    const querytocheckwithID = `SELECT * FROM BOOKS
                                WHERE ID = ${bookid}`
    query(querytocheckwithID, (result) => {
      if (result.rows[0]) {
        var booktoupdate = req.body
        const queryforPATCH = `UPDATE BOOKS SET
                               ${"name" in booktoupdate ? "NAME = '" + booktoupdate["name"] + "'," : ''}
                               ${"author" in booktoupdate ? "AUTHOR = '" + booktoupdate["author"] + "'," : ''}
                               ID = ${bookid}
                               WHERE ID = ${bookid}`
        query(queryforPATCH, (result) => {
          res.status(201).send('Book updated')
        })
      } else {
        res.status(500).send('Book with given ID not found')
      }
    })

  } else {
    res.status(500).send('Request does not contain Id')
  }
})
