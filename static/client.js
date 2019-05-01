let tweets;
let xhr = new XMLHttpRequest();
xhr.open('GET', 'tweets.json');
xhr.onload = function() {
  if (xhr.status === 200){
    tweets = JSON.parse(xhr.responseText);
  }
  else {
    console.error(xhr.status);
    tweets = [];
  }
};
xhr.send();

const socket = io();
socket.on('new tweet', (tweet) => {
  tweets.push(tweet);
  if (tweets.length > 1000){
    tweets.shift();
  }
  console.log(tweets);
});
