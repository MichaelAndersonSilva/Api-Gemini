const express = require('express')
const app = express()

const router  = require('./Router/router_Gemini')

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

//Trasnforma a requisição em json
app.use(express.json());

app.use('/gemini' , router)

module.exports = app