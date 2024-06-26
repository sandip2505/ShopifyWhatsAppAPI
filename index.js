
const express = require('express');
const cors = require('cors');
const http = require('http');
const ngrok = require('@ngrok/ngrok');
const fileUpload = require("express-fileupload");
const bodyParser = require('body-parser');
const mongoose = require('./src/db/db');
const app = express();
app.use(express.json());
app.set('trust proxy', true);

app.use(cors());

app.use(fileUpload());
app.use(express.json());
app.use(express.static('./'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// Require your routes and use them here
const userRoute = require('./src/route/userRoute');
app.use('/api', userRoute);
app.get('/', (req, res) => {
  res.send('API is running');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
