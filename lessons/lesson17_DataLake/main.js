const express = require('express')
const app = express()
const pg = require('pg')
const md5 = require('md5')
const PORT = process.env.PORT || 9015
const connectToQueue = require('./producer')
const CONSTANTS = require('./CONSTANTS')

var pendingMessagesCount = 0

const client = new pg.Client({
  user: "cnaioccqnnsjhb",
  password: "e4f261adff7096f9bc1b367e0eaa916612a604436dd06d4d72d101496c690c70",
  database: "d9nlk2tgtsgjrp",
  port: 5432,
  host: "ec2-23-23-234-118.compute-1.amazonaws.com",
  ssl: true
})

client.connect((err) => {
  if (err) {
    throw err
  } else {
    app.listen(PORT, () => {
      console.log('Server Ready')
      //Run job to poll from customers table & compare with
      //the customers_mirror table

      // setInterval(pollForUpdates, 1000)

      // pollForUpdates(client, (result) => {
      //   console.log('Rows retrieved are', result.rows[2].firstname)
      // })

      var interval = setInterval(function() {
        connectToQueue((channel) => {
          pollForUpdates(client, channel, (result) => {
            //console.log('COUNT OF NEW MESSAGES FOR THE QUEUE IS', pendingMessagesCount)
          })
        })
      }, 60000)

    })
  }
})

const pollForUpdates = (client, channel, callback) => {
  const customers_query_matches = `SELECT CUST.ID, CUST.FIRSTNAME, CUST.LASTNAME, CUST.GENDER,
                           CUST.DEPOSIT, CUST.EMAIL,
                           MIRROR.MD5HASH, MIRROR.PROCESSED FROM
                           CUSTOMERS CUST, customers_mirror MIRROR WHERE
                           CUST.EMAIL = MIRROR.EMAIL`

  const customers_query_new_entries = `SELECT CUST.ID, CUST.FIRSTNAME, CUST.LASTNAME, CUST.GENDER,
                                      CUST.DEPOSIT, CUST.EMAIL FROM CUSTOMERS CUST
                                      LEFT JOIN customers_mirror MIRROR
                                      ON MIRROR.EMAIL = CUST.EMAIL
                                      WHERE MIRROR.EMAIL IS NULL`

  //Processing for new customers
  client.query(customers_query_new_entries, (err, result) => {
    var concat_newcustomers_row  = ''
    var newcustomer_md5 = ''

    if (err) {
      console.error(err)
    } else {
      if (result.rows) {
        var newcustomers = result.rows
        console.log('New CUSTOMERS FOUND', newcustomers.length)
        newcustomers.forEach((row) => {
          concat_newcustomers_row = `${row.firstname}${row.lastname}${row.gender}
          ${row.deposit}${row.email}`
          newcustomer_md5 = md5(concat_newcustomers_row)
          var insertquery = `INSERT INTO customers_mirror (Id,firstname, lastname, email, gender, deposit, md5hash)
          VALUES ('${row.id}',$$${row.firstname}$$,$$${row.lastname}$$,
          '${row.email}','${row.gender}','${row.deposit}','${newcustomer_md5}')`
          var customer_JSON = {
            firstName: row.firstname,
            lastName: row.lastname,
            email: row.email,
            gender: row.gender,
            deposit: row.deposit,
            accountnumber: row.id
          }

          client.query(insertquery, (err, result) => {
            if (err){
              console.log(err)
            } else {
              //console.log('CREATING NEW CUSTOMER')
              if(result.rows) {
                //console.log('NEW CUSTOMER CREATED',result.rows)
                channel.sendToQueue(CONSTANTS.QUEUE_NAME, new Buffer(JSON.stringify(customer_JSON)))
                pendingMessagesCount+= newcustomers.length
              }
            }

          })

        }) //End foreach for new customers
      } //end else i.e. when rows exit to insert
    }
  })


  client.query(customers_query_matches, (err, result) => {
    if (err) {
      console.error(err)
    } else {
      //Process records where customer entries exist
      //Update or ignore based on the md5hash comparison
      if(result.rows){
        console.log('*** In Existing Matches Else ****')
        var existing_customer_rows = result.rows

        existing_customer_rows.forEach((row) => {
          //Create md5 hash for customer row and compare with hash in
          //mirror table

          var customer_JSON = {
            firstName: row.firstname,
            lastName: row.lastname,
            email: row.email,
            gender: row.gender,
            deposit: row.deposit,
            accountnumber: row.id
          }

          var concat_customer_row = `${row.firstname}${row.lastname}${row.gender}
                                     ${row.deposit}${row.email}`
          var customer_md5 = md5(concat_customer_row)
          //console.log('2 hash values', customer_md5, row.md5hash, concat_customer_row)
          if(row.md5hash == null || row.md5hash == ''){
          //  console.log('Row exists without a hash - check initial load')
          } else {
            if(customer_md5 == row.md5hash && row.processed != true) {
              // client.query(`UPDATE customers_mirror SET
              //               PROCESSED = true WHERE
              //               EMAIL = '${row.email}'`, (err, result) => {
              //  if (err) {
              //    console.error(err)
              //  } else {
              //    console.log('Processed marked to true')
              //  }
              // })
            //  console.log('Existing customer without MD5hash')

              console.log('In Update the customer json is ', customer_JSON)
              channel.sendToQueue(CONSTANTS.QUEUE_NAME, new Buffer(JSON.stringify(customer_JSON)))
            } else {
              if(row.md5hash != customer_md5) {
                pendingMessagesCount+= 1
                client.query(`UPDATE CUSTOMERS_MIRROR SET
                              FIRSTNAME = $$${row.firstname}$$, LASTNAME = $$${row.lastname}$$,
                              GENDER = '${row.gender}', DEPOSIT = '${row.deposit}',
                              MD5HASH = '${customer_md5}'
                              WHERE EMAIL = '${row.email}'`, (err, result) => {
                                if (err) {
                                  console.error(err)
                                } else {
                                  //console.log('IN HASH not matching loop, the result is', result)
                                  channel.sendToQueue(CONSTANTS.QUEUE_NAME, new Buffer(JSON.stringify(customer_JSON)))
                                }
                              //console.log('Row updated in mirror table per updated customer values ', row.id)
                              //console.log('In UPDATE Customer Loop',  pendingMessagesCount)
                })
              }
            }
          } //end else

        }) //end foreach when matches are found
      }

      //callback(pendingMessagesCount)
    }
  })

callback(pendingMessagesCount)
pendingMessagesCount = 0


}


//
// `SELECT CUST.FIRSTNAME, CUST.LASTNAME, CUST.GENDER,
//  CUST.DEPOSIT, CUST.EMAIL, MIRROR.FIRSTNAME,
//  MIRROR.LASTNAME, MIRROR.GENDER, MIRROR.DEPOSIT,
//  MIRROR.EMAIL, MIRROR.MD5HASH FROM
//  CUSTOMERS CUST, customers_mirror MIRROR WHERE
//  CUST.EMAIL = MIRROR.EMAIL`


// SELECT CUST.FIRSTNAME, CUST.LASTNAME, CUST.GENDER,
// CUST.DEPOSIT, CUST.EMAIL
// FROM CUSTOMERS CUST
// LEFT JOIN
// customers_mirror MIRROR
// ON MIRROR.EMAIL = CUST.EMAIL
// WHERE MIRROR.EMAIL IS NULL










// CREATE TABLE customers (
//     id char(5) PRIMARY KEY,
//     firstname varchar(40) NOT NULL,
//     lastname  varchar(40) NOT NULL,
//     email varchar(60),
//     gender char(6),
//     account varchar(60),
//     deposit double precision,
//     preference char(6)
// );
//
// CREATE TABLE customers_mirror (
//     id char(5) PRIMARY KEY,
//     firstname varchar(40) NOT NULL,
//     lastname  varchar(40) NOT NULL,
//     email varchar(60),
//     gender char(6),
//     account varchar(60),
//     deposit varchar(7),
//     preference varchar(15),
//     processed boolean default false,
//     md5hash varchar(60)
// );


// `SELECT CUST.FIRSTNAME, CUST.LASTNAME, CUST.GENDER,
//                          CUST.DEPOSIT, CUST.EMAIL, MIRROR.FIRSTNAME,
//                          MIRROR.LASTNAME, MIRROR.GENDER, MIRROR.DEPOSIT,
//                          MIRROR.EMAIL, MIRROR.MD5HASH, MIRROR.PROCESSED FROM
//                          CUSTOMERS CUST, customers_mirror MIRROR WHERE
//                          CUST.EMAIL = MIRROR.EMAIL`
