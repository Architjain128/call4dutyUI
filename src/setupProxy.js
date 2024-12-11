// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(
//     '/api', // Specify the path prefix for the API
//     createProxyMiddleware({
//       target: 'https://qa6-call-for-duty-global.sprinklr.com', // Backend URL
//       changeOrigin: true,
//       pathRewrite: {
//         '^/api': '', // Remove '/api' prefix when forwarding the request
//       },
//     })
//   );
// };
