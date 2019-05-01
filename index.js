const Twitter = require('twitter');
const fs = require('fs');
require('dotenv').config()

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const chicago = "-87.939444,41.644583,-87.523333,42.022778";
const params = {locations: chicago};
const stream = client.stream('statuses/filter', params);

stream.on('data', function(event) {
  if (event.coordinates){
    console.log(event.coordinates, event.text);
    fs.readFile('tweets.json', (err, data) => {
      let json = JSON.parse(data);
      json.push(event.coordinates.coordinates);
      fs.writeFile('tweets.json', JSON.stringify(json), (err) => {
        if (err) throw err;
      });
    });
  }
});

stream.on('error', function(error) {
  throw error;
});
