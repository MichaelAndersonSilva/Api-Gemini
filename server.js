const http = require('http')
const app = require('./app')
const port = 3000 || process.env.port

const server  = http.createServer(app)

server.listen(port, () => {console.log("Servidor rodando na porta " + port)})