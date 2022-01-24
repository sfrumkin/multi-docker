const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
redisClient.on('connect', function() {
  console.log('Connected!');
});

const sub = redisClient.duplicate();

sub.on('connect', function() {
  console.log('sub Connected!');
});



function fib(index) {

  if (index < 2) return 1;

  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  console.log(`Received message from ${channel} channel.`);
  console.log(message);
  
  redisClient.hset('values', message, fib(parseInt(message)));
})

sub.subscribe('insert', (err, count) => {
  if(err) console.error(err.message);
  console.log(`Subscribed to ${count} channels.`);
  
});
