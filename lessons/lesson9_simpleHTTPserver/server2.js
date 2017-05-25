var wodgyHTTP = require('./customServerLib.js');

// wodgyHTTP.route : (String,ANY) => void
wodgyHTTP.route('/', './home.html');
wodgyHTTP.route('/hello', './hello.html');

wodgyHTTP.route('/bye', function() {
  return '<h1>test</h1>';
});


wodgyHTTP.start(8080);
