const multer = require('multer');
const fileUtils = require('../utils/fileUtils');

let baseDir: string = '';
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      console.log(file);
      baseDir = Date.now() + '';
      let tempPath = `project/${baseDir}`
      fileUtils.noExitAndCreate(tempPath);
      cb(null, tempPath); // 存储目录为当前目录下的uploads文件夹
    },
    filename: (req: any, file: any, cb: any) => {
      // console.log(file);
      cb(null, file.originalname); // 为文件生成唯一的文件名
    }
  });
  
  const upload = multer({ storage });

  module.exports = {
    upload,
    baseDir
  };