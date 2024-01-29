const express = require('express');
const db = require('../db/index');
const router = express.Router();

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
      console.log(req.params.id);
      let result = await db.delProject(+req.params.id);
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
      console.log(req.body);
      let result = await db.delProject(+req.params.id);
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