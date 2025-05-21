const express = require('express');
const router = express.Router();
const db = require('../module/db-operator/index');
const files = require('../module/file-operator/index');
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

router.get('/relative', (req: any, res: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.query.base_dir) {
    res.send({
      data: files.getFileRelative(req.query.base_dir, req.query.entry),
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
    data: files.getSingleFile(req.query.path),
    code: '',
    message: ''
  })
})

router.post('/upload', formMiddleWare,async (req: any, res: any, next: any) => {
  let result = await db.addProject(req.project);
  res.send({
    data: result,
    code: 200,
    message: 'success'
  });
});

module.exports = router;