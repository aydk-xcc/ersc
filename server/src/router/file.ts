const express = require('express');
const router = express.Router();
const files = require('../module/files');
const formMiddleWare = require('../middleware/formidable');


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
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.send({
    data: files.getSingleFile(req.query.name, req.query.path),
    code: '',
    message: ''
  })
})

router.post('/upload', formMiddleWare,(req: any, res: any, next: any) => {
  res.send({
    data: {
      tempPath: req.tempPath,
      totalRows: req.totalRows
    },
    code: '',
    message: 'success'
  })
});

module.exports = router;