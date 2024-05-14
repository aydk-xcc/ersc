const express = require('express');
const db = require('../module/db-operator/index');
const router = express.Router();
const {existAndDelete} = require('../utils/fileUtils');
const {BASE_DIR} = require('../const/const');

router.get('', async (req: any, res: any) => {
    try {
      let query = req.query;
      let rows = await db.getProjects(query);
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
  
  router.delete('/:id', async (req: any, res: any) => {
    try {
      let base_dir = req.query.base_dir;
      let result = await db.delProject(+req.params.id);
      existAndDelete(BASE_DIR + '/' + base_dir);
      res.send({
        data: result,
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

  router.post('' ,async (req: any, res: any) => {
    try {
      let result = await db.addProject(req.body);
      res.send({
        data: result,
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






  module.exports = router;