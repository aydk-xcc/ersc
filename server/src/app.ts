const express = require('express')
const dotenv = require('dotenv');
const app = express()
dotenv.config();
var files = require('./codefile/files.ts');

app.get('/api/v1/file/files', (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send({
    data: files.getFiles(),
    code: '',
    message: ''
  })
})

app.get('/api/v1/file/single_file', (req: any, res: any) => {
  console.log(req.query);
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send({
    data: files.getSingleFile(req.query.name, req.query.path),
    code: '',
    message: ''
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})