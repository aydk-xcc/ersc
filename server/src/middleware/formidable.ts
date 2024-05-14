const {formidable} = require("formidable");
const {BASE_DIR} = require('../const/const');
const fileUtils = require('../utils/fileUtils');
const computeRows = require('../module/compute-rows/index');
const fs = require('fs');
const path = require('path');


// middlewares that populates req.fields and req.body
const formMiddleWare = (req: any, res: any, next: any) => {
  let obj = {
    name: '',
    version: '',
    entry: '',
    all_rows: 0,
    base_dir: Date.now() + '_' + Math.round(Math.random() * 1E9)
  }
  fileUtils.noExistAndCreate(BASE_DIR + '/' + obj.base_dir);
  const form = formidable();
  form.onPart = (part: any) => {
    if (part.mimetype) {
      let filePath = `${BASE_DIR}/${obj.base_dir}/${part.originalFilename}`;
      fileUtils.noExistAndCreate(path.dirname(filePath));
      const writableStream = fs.createWriteStream(filePath);
      part.on('data', (buffer: any) => {
        writableStream.write(buffer);
        const textContent = buffer.toString('utf-8');
        obj.all_rows += computeRows(part.originalFilename, textContent);
        
      });
      part.on('end', () => {
        writableStream.end();
      });
    } else {
      part.on('data', (buffer: any) => {
        if (part.name === 'name') {
          obj.name = buffer.toString('utf-8');
        } else if (part.name === 'version') {
          obj.version = buffer.toString('utf-8');
        } else if (part.name === 'entry') {
          obj.entry = buffer.toString('utf-8');
        }
      });
    }
  };

  form.parse(req, (err: any, fields: any, files: any) => {
    if (err) {
      next(err);
      return;
    }
    req.project = obj;
    next();
  });
};

module.exports = formMiddleWare;