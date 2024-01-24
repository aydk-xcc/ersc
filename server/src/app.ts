const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const app = express()
const fileUtils = require('./utils/fileUtils');
const db = require('./db/index');

dotenv.config();
db.initDB();
console.log(db.getProjects(1));
var files = require('./codefile/files.ts');

app.get('/api/v1/file/files', async (req: any, res: any) => {
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

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    console.log(file);
    fileUtils.noExitAndCreate('project/' + file.fieldname);
    cb(null, 'project/' + file.fieldname); // 存储目录为当前目录下的uploads文件夹
  },
  filename: (req: any, file: any, cb: any) => {
    // console.log(file);
    cb(null, file.originalname); // 为文件生成唯一的文件名
  }
});

const upload = multer({ storage });

app.post('/api/v1/file/upload', upload.any(), (req: any, res: any) => {
  console.log(req.files);
  
  res.send({
    data: null,
    code: '',
    message: '123'
  })
});

app.get('/api/v1/projects', async (req: any, res: any) => {
  try {
    let rows = await db.getProjects(1);
    res.send({
      data: rows,
      code: 200,
      message: 'success'
    })
  } catch (error) {
    res.send({
      data: null,
      code: 500,
      message: error
    })
  }
});



app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})