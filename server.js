const express = require('express')
const server = express()

server.use('/', express.static(__dirname + '/build_webpack'))

server.get('/*', (req, res) => {
  res.sendFile(__dirname + '/build_webpack/index.html')
})

const port = process.env.PORT
server.listen(port, () => {
  console.log('server listening on port ' + port)
})
