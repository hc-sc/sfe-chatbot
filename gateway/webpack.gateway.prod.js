const
  merge = require('webpack-merge'),
  common = require("./webpack.gateway.common.js");

/**
 * @constant {Object} gatewayConfig
 * @description Webpack config for the frontend web components of the service gateway
 */
const gatewayProdConfig = merge.strategy({
  entry: 'replace',
  mode: 'replace',
  devtool: 'replace',
})( common, {

  mode: 'production',

  devtool: 'hidden-source-map',

  entry: {

    // Polyfills
    polyfill: [
      'whatwg-fetch',
      '@babel/polyfill',
    ],

    // Chatbot
    alfred: [
      './src/chat/alfred',
    ],
  },

} );

module.exports = gatewayProdConfig;
