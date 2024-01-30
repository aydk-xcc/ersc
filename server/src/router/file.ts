const express = require('express');
const router = express.Router();
const {formidable} = require("formidable");
const multer = require('../middleware/multer');
var files = require('../codefile/files.ts');
const fileUtils = require('../utils/fileUtils');

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

router.post('/upload',(req: any, res: any, next: any) => {
  let tempPath = Date.now() + '_' + Math.round(Math.random() * 1E9);;
  fileUtils.noExitAndCreate(tempPath);
  const form = formidable({ 
    multiples: true,
    uploadDir: 'project/' + tempPath,
    keepExtensions: true,
    createDirsFromUploads: true,
    filename: (name: string, ext: string, part: any, form: any) => {
      const { originalFilename} = part;
      console.log(name, originalFilename);
      return originalFilename;
    }
  });

  form.parse(req, (err: Error, fields: any, files: any) => {
    if (err) {
      next(err);
      return;
    }
    res.send({
      data: tempPath,
      code: '',
      message: 'success'
    })
  });
});

module.exports = router;