const file = require('./file');
const fileRelative = require('./file-relative');

module.exports = {
    ...file,
    ...fileRelative
}