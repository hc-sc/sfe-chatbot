// Workaround for Jest, extract and export babel from webpack config so Jest can consume it.
const wpConfig = require('./webpack.server.prod');

module.exports = wpConfig
  .module
  .rules[ 0 ]
  .use
  .options;
  

// TODO: Run tests on front AND back ends
// const wpConfig = [
//   require('./webpack.server.common'),
//   require('./webpack.gateway.common'),
// ];

// module.exports = wpConfig
//   .module
//   .rules[ 0 ]
//   .use
//   .options;
