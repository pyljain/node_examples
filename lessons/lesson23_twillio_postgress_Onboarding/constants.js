module.exports =
{
  PORT: process.env.PORT || 9050,
  URL: 'amqp://ipzdxeej:a_HybBhKV6ZPNYUDjpXlhuILIMnwNuLI@fish.rmq.cloudamqp.com/ipzdxeej',
  QUEUE_NAME: 'OnboardingSMSStream',
  CONNECTION_OBJ: {
    user: "cnaioccqnnsjhb",
    password: "e4f261adff7096f9bc1b367e0eaa916612a604436dd06d4d72d101496c690c70",
    database: "d9nlk2tgtsgjrp",
    port: 5432,
    host: "ec2-23-23-234-118.compute-1.amazonaws.com",
    ssl: true
  },
  TWILIO_ACCOUNT: 'AC660f50a73df1c1ad93110ef719d4b249',
  AUTHTOKEN: '8991966a480a058775b6c6ff92d9e2c8'   // Your Auth Token from www.twilio.com/console
}
