const net = require('net')
const fs = require('fs')
var subscribers = {}

module.exports = {
  connect: function(port, ip, callback){
    var client = net.connect(port,ip, () => {
      var server = {
        write : function(queuename, messagefromclient) {
          var stringified_message_to_server = {
            queue : queuename,
            message : messagefromclient
          }
          client.write(JSON.stringify(stringified_message_to_server))
        },

        listen: function(queuename, message_callback) {
          var obj_to_listen_to = {
            listenTo : queuename
          }

          client.write(JSON.stringify(obj_to_listen_to))

          client.on('data', (data) => {
            var messages = data.toString().split('\n') //To split the messages
            //received from the server as the server may combine messages together
            //while sending
            console.log('Messages', messages)
            messages.forEach((split_message) => {
              if (split_message != '') {
                var split_messageJSON = JSON.parse(split_message)
                message_callback(split_messageJSON.message)
              }
            })
          })
        }
      }
      callback(server);
    })
  },

  createServer: function(port, ip, filename) {
    const server = net.createServer((socket) => {
      socket.on('data', (data) => {

        var data_JSON = JSON.parse(data.toString())

        if('listenTo' in data_JSON){
          //Add to subscriber list
          if(data_JSON.listenTo in subscribers){
            subscribers[data_JSON.listenTo].push(socket)
          } else {
            subscribers[data_JSON.listenTo] = []
            subscribers[data_JSON.listenTo].push(socket)
          }

          //Send historical messages for queue
          fs.readFile(filename, (err, file_contents) => {
            if(err){
              console.log(err)
            } else {
              var file_contents_JSON = JSON.parse(file_contents)
              if(data_JSON.listenTo in file_contents_JSON){
                var messages = file_contents_JSON[data_JSON.listenTo]
                messages.forEach((msg) => {
                  var send_msgs_to_client = {
                    queue : data_JSON.listenTo,
                    message: msg
                  }
                  socket.write(JSON.stringify(send_msgs_to_client)+'\n')
                })
              }
            }
          })


        } else {
          //Read existing file content
          fs.readFile(filename, (err, current_content) => {
            if(err){
              console.log('Error occured in reading file', err)
            } else {
              if(current_content == null || current_content == ''){
                current_content = '{}'     // JSON.parse : (String) => Object, hence string needed around empty object
              }
              //Format of the object I want
              // var obj = {
              //   Queue_name_1 : ['Message_1', 'Message_2'],
              //   Queue_name_2 : ['Message_1', 'Message_2'],
              // }

              var current_content_JSON = JSON.parse(current_content) //File stores as strings

              if(data_JSON.queue in current_content_JSON){
                current_content_JSON[data_JSON.queue].push(data_JSON.message)
              } else {
                current_content_JSON[data_JSON.queue] = []
                current_content_JSON[data_JSON.queue].push(data_JSON.message)
              }

              fs.writeFileSync(filename, JSON.stringify(current_content_JSON))

              if(data_JSON.queue in subscribers){
                subscribers[data_JSON.queue].forEach((sub) => {
                  sub.write(JSON.stringify(data_JSON))
                })
              }
            }
          })
        }
      })
    })

    server.listen(port, ip)
  }
}
