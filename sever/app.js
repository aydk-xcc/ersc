const express = require('express')
const app = express()
const port = 3000
var files = require('./codefile/files');

app.get('/files', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send(files.getFiles())
})

app.get('/singlefile', (req, res) => {
  console.log(req.query);
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send(files.getSingleFile(req.query.name, ''))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})