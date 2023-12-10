const express = require('express')
const app = express()
const port = 3000
var files = require('./codefile/files');

app.get('/api/v1/file/files', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send({
    data: files.getFiles(),
    code: '',
    message: ''
  })
})

app.get('/api/v1/file/single_file', (req, res) => {
  console.log(req.query);
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send({
    data: files.getSingleFile(req.query.name, req.query.path),
    code: '',
    message: ''
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})