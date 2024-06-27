const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('strictQuery', false);
mongoose.set('debug', true); 

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, 
  socketTimeoutMS: 45000, 
};

mongoose.connect(process.env.MONGO_URI, dbOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose connection disconnected');
});

module.exports = mongoose;
