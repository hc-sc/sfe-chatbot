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
  // 'module.rules': 'replace',
  // optimization: 'replace',
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

    // Gateway search
    'search/gateway/global': [
      'url-search-params-polyfill',
      './src/search/gateway/search-ui.global',
    ],
    'search/gateway/ui': [
      './src/search/gateway/search-ui',
    ],

    // Software search
    'search/software/ui': [
      './src/search/software/search-ui',
    ],
  },

} );

module.exports = gatewayProdConfig;
