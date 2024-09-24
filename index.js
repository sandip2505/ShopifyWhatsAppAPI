const express = require('express');
const cors = require('cors');
const fileUpload = require("express-fileupload");
const bodyParser = require('body-parser');
const { connectToDatabase } = require('./src/db/db');
const app = express();

app.use(express.json());
app.set('trust proxy', true);
app.use(cors());
app.use(fileUpload());
app.use(express.static('./'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Require your routes and use them here
const userRoute = require('./src/route/userRoute');
app.use('/api', userRoute);

let connectionStatus = { isConnected: false, error: null };

// Connect to the database
connectToDatabase()
  .then((connected) => {
    connectionStatus.isConnected = connected;
    connectionStatus.error = connected ? null : 'Failed to connect to MongoDB';
  })
  .catch((err) => {
    connectionStatus.isConnected = false;
    connectionStatus.error = err.message;
  });

app.get('/', (req, res) => {
  if (connectionStatus.isConnected) {
    res.send('API is running. Connected to MongoDB');
  } else if (connectionStatus.error) {
    res.send(`API is running. ${connectionStatus.error}`);
  } else {
    res.send('API is running. MongoDB connection status unknown');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});