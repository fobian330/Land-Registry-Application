require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/landregistry';

// Debug logging
console.log('MongoDB URI loaded:', !!MONGO_URI);

module.exports = {
  MongoURI: MONGO_URI,
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  NEXMO_API_KEY: process.env.NEXMO_API_KEY,
  NEXMO_API_SECRET: process.env.NEXMO_API_SECRET,
  NEXMO_FROM_NUMBER: process.env.NEXMO_FROM_NUMBER
};
