const computeJavascriptRows = require('./javascript');
const {getFileExt}  = require('../../utils/fileUtils');
const {EXT_TYPE} = require('../../const/const');

module.exports = (name: string, str: string) => {
    switch(getFileExt(name)) {
        case EXT_TYPE.TYPESCRIPT:
        case EXT_TYPE.JAVASCRIPT:
            return computeJavascriptRows(str);
    }
}