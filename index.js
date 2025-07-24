const express = require('express');
const cors = require('cors');
// const fileUpload = require("express-fileupload");
const bodyParser = require('body-parser');
const { connectToDatabase } = require('./src/db/db');
const app = express();
const path = require('path');


app.use(express.json());
app.set('trust proxy', true);
app.use(cors());
// app.use(fileUpload());
app.use(express.static('./'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));
const PORT = process.env.PORT || 3000;

// Require your routes and use them here
const userRoute = require('./src/route/userRoute');
app.use('/api', userRoute);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
    res.render('index', { title: 'Home' });
    // res.send('API is running. Connected to MongoDB');
  } else if (connectionStatus.error) {
    res.send(`API is running. ${connectionStatus.error}`);
  } else {
    res.send('API is running. MongoDB connection status unknown');
  }
});

app.get('*', (req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
  // res.status(404).send('Page Not Found');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});