// query : (String, (Object) => void) => void
const pg = require('pg')

const query = (query, callback) => {

  const client = new pg.Client({
    user: "cnaioccqnnsjhb",
    password: "e4f261adff7096f9bc1b367e0eaa916612a604436dd06d4d72d101496c690c70",
    database: "d9nlk2tgtsgjrp",
    port: 5432,
    host: "ec2-23-23-234-118.compute-1.amazonaws.com",
    ssl: true
  })

  client.connect((err) => {
    if (err) throw err
    client.query(query, (err, result) => {
      if (err) throw err
      client.end()
      callback(result)
    });
  });
}


module.exports = query;
