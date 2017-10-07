const express = require('express')
const path = require('path')
const server = express()

server.use('/', express.static(path.join(__dirname, '/build_webpack')))

server.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname,'/build_webpack/index.html'))
})

const port = process.env.PORT
server.listen(port, () => {
  console.log('server listening on port ' + port)
})
