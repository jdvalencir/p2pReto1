// restApi.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hola Mundo desde REST API!');
});

module.exports = app;
