export function resolve(...arg) {
   if (arg.length === 0) {
        return '';
   }
   if (arg.length === 1) {
        return arg[0];
   }
   let arr = arg.reverse();
//    debugger;
   let path = arr.reduce((left, right) => {
        let lArr = left.split('/');
        let rArr = right.split('/');
        // console.log(left, lArr);
        if (lArr[0] === '.') {
            // 目录
            if (left.endsWith('/')) {
                return rArr.slice(1).join('/') + left;
            } else {
                return rArr.slice(0, -1).join('/') + '/' + lArr.slice(1).join('/');
            }
        }  else if (lArr[0] === '..') {
            // 目录
            if (left.endsWith('/')) {
                return rArr.slice(0, -1).join('/') + '/' + lArr.slice(1).join('/');
            } else {
                return rArr.slice(0, -2).join('/') + '/' + lArr.slice(1).join('/');
            }
        }      
   });
   return path
}



export default {
    resolve
}