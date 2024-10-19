const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const uri = process.env.MONGODB_URI

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once( 'open', () => {
  console.log('Connected to MongoDB');
});

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/', require('./routes/route'));
app.use('/', require('./routes/document'));
app.use('/', require('./routes/admin'));

app.listen( port, () => {
  console.log(`App is running on port: ${port}`);
});