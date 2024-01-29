const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer');
var files = require('../codefile/files.ts');

router.get('/files', async (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.query.base_dir) {
    res.send({
      data: files.getFiles(req.query.base_dir),
      code: 200,
      message: ''
    })
  } else {
    res.send({
      data: null,
      code: '',
      message: 'base_dir 不能为空'
    })
  }
})

router.get('/single_file', (req: any, res: any) => {
  console.log(req.query.base_dir);
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send({
    data: files.getSingleFile(req.query.name, req.query.path),
    code: '',
    message: ''
  })
})

router.post('/upload', multer.upload.any(), (req: any, res: any) => {
  console.log(req.files, multer.baseDir);
  
  res.send({
    data: multer.baseDir,
    code: '',
    message: '123'
  })
});

module.exports = router;