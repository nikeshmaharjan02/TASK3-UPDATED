const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const redisClient = redis.createClient({
    url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

redisClient.connect().then(() => {
    console.log('Connected to Redis');
}).catch(console.error);

module.exports = redisClient;
