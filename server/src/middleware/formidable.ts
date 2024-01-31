const {formidable} = require("formidable");
const {BASE_DIR} = require('../const/const');
const fileUtils = require('../utils/fileUtils');
const computeRows = require('../module/compute-rows/index');


// middlewares that populates req.fields and req.body
const formMiddleWare = (req: any, res: any, next: any) => {
  let tempPath = Date.now() + '_' + Math.round(Math.random() * 1E9);
  let totalRows = 0;
  fileUtils.noExistAndCreate(BASE_DIR + '/' + tempPath);
  const form = formidable({ 
    multiples: true,
    uploadDir: BASE_DIR + '/' + tempPath,
    keepExtensions: true,
    createDirsFromUploads: true,
    filename: (name: string, ext: string, part: any, form: any) => {
      const { originalFilename} = part;
      return originalFilename;
    }
  });
  form.onPart = (part: any) => {
    part.on('data', (buffer: any) => {
      const textContent = buffer.toString('utf-8');
      totalRows += computeRows(part.originalFilename, textContent);
    });
  };

  form.parse(req, (err: any, fields: any, files: any) => {
    if (err) {
      next(err);
      return;
    }
    req.tempPath = tempPath;
    req.totalRows = totalRows;
    next();
  });
};

module.exports = formMiddleWare;