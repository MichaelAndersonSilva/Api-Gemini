require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./Router/router_Gemini');

const enableCors = process.env.ENABLE_CORS === 'true';

if (enableCors) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
}

// Transformar a requisição em JSON
app.use(express.json());

app.use('/gemini', router);

module.exports = app;
