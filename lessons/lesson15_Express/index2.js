const express = require('express')
const app = express()
const mustache = require('mustache-express')
const query = require('./postgressclient')

app.engine('mustache', mustache())

app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

var obj = {
  "name" : "Test",
  "number": 123
}

const PORT = process.env.PORT || 9045
app.use(express.static('public'))

app.listen(PORT, () => {
  console.log('Server connected')
})

app.get('/', (req, res) => {
  //res.render('index', obj)
  const selectbooksquery = `SELECT * FROM BOOKS`
  query(selectbooksquery, (result) => {
    var books_JSON = {
      rows: result.rows
    }

    console.log('Books retrieved are', result.rows)
    res.render('index2', books_JSON)
  })

})
