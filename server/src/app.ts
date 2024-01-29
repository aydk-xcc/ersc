const express = require('express');
const dotenv = require('dotenv');
const app = express()
const db = require('./db/index');

const projectRouter = require('./router/project');
const fileRouter = require('./router/file');

dotenv.config();
db.initDB();

app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/file', fileRouter);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})