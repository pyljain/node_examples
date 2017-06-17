const express = require('express')
const bodyparser = require('body-parser')

const app = express()
app.use(bodyparser.json())
const PORT = process.env.port || 9045

var book = {
  1 : {
    name: "Cuckoo's Calling",
    author: "Robert G"
  }
}

app.listen(PORT, () => {
  console.log('Server has started')
})

//app.get: (String,(Object,Object) => void) => void
app.get('/books/:id', (req, res) => {
  // Inputs from a URL is mostly a string
  var bookId = parseInt(req.params.id)
  if(bookId in book)
    res.json(book[bookId])
  else
    res.status(404).send('Not Found')

})

app.post('/books', (req, res) => {
  var inputbook = req.body
  var bookid = req.body.id

  if(bookid){
    if(bookid in book) {
      res.status(500).send('Book already exists')
    } else {
      book[bookid] = {
        name: req.body.name,
        author: req.body.author
      }
      res.status(201).send('Successfully inserted')
    }

  } else {
    res.status(500).send('ID not included in request')
  }
})
