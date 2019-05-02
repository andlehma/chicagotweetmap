const Twitter = require('twitter');
const fs = require('fs');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 8000;
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

    let coords = event.coordinates.coordinates;

    // write to server console
    console.log(coords, event.text);

    // only care about tweets with coordinates in Chicago
    if (coords[0] < -87.523333 && coords[0] > -87.939444 &&
      coords[1] < 42.022778 && coords[1] > 41.644583){
        // write to file
        let filename = 'static/tweets.json';
        fs.readFile(filename, (err, data) => {
          let json = JSON.parse(data);
          json.push(coords);
          if (json.length > 1000){
            json.shift();
          }
          fs.writeFile(filename, JSON.stringify(json, null, 2), (err) => {
            if (err) throw err;
          });
        });

        // send to client
        io.emit('new tweet', coords);
      }
    }
  });

  stream.on('error', function(error) {
    console.log(error);
  });

  app.use(express.static('static'))

  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

  http.listen(port, function(){
    console.log('listening on *:' + port);
  });
