require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const server = require('./backend/Controller/user');
const config = require('./backend/Config/db_config');

// Debug logging
console.log('Environment check:', {
  currentDir: __dirname,
  mongoURI: process.env.MONGO_URI,
  configMongoURI: config.MongoURI
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Check if MongoURI exists
const { MongoURI } = config;
if (!MongoURI) {
  console.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}

// Connect to MongoDB with error handling
mongoose
  .connect(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
  })
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

const port = process.env.PORT || 3001;

app.use('/', server);

app.listen(port, () => {
  console.log('App is running on port ' + port);
});
