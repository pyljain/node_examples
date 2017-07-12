module.exports = {
  CLIENT: {
    user: "cnaioccqnnsjhb",
    password: "e4f261adff7096f9bc1b367e0eaa916612a604436dd06d4d72d101496c690c70",
    database: "d9nlk2tgtsgjrp",
    port: 5432,
    host: "ec2-23-23-234-118.compute-1.amazonaws.com",
    ssl: true
  },
  QUERY: `SELECT ID, FIRSTNAME, LASTNAME FROM PARTNERS`,
  BASEURL: 'https://ctaidentity-developer-edition.eu11.force.com',
  USERNAME: 'dodgywodgyidentity@cta.com',
  CONSUMERKEY: '3MVG9HxRZv05HarSPq0qF3jdOU2KRM3dYJmTd3X0P4jxakYWWDqLMMsiRgdgY7EsWFMsvy9YkwfEIqsXJagd.',
  KEY: require('fs').readFileSync('./PrivateKey.key', 'utf8')
}
