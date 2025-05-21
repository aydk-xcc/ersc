// {
//     fileName: "deploy/nginx/default.conf.template",
//     linesDeleted: 0,
//     linesInserted: 11,
//     oldFileName: "",
//     status: "M" A D
// }


// diff --git a/config/index.js b/config/index.js
// index 638579b..c43a878 100644
// --- a/config/index.js
// +++ b/config/index.js
// @@ -15,8 +15,13 @@
//          index: 'index.html',
//          proxyTable: [
//              {
// +                context: ['core'],
// +                target: 'http://dev-task.dep.bce.baidu-int.com/',
// +                changeOrigin: true
// +            },
// +            {
//                  context: ['**'],
// -                target: 'http://tianniu-preonline.baidu-int.com/',
// +                target: 'http://10.27.141.79:8881/',
//                  changeOrigin: true
//              }
//          ],