var Twitter = require('twitter');
require('dotenv').config()

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var params = {locations: "-87.939444,41.644583,-87.523333,42.022778"};
var stream = client.stream('statuses/filter', params);

stream.on('data', function(event) {
  console.log(event && event.text);
});

stream.on('error', function(error) {
  throw error;
});
