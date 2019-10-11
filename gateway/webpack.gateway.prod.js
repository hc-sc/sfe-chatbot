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

  // module: {

  //   rules: [

  //     // Replace constants
  //     // TODO: Add prod constants to prod config
  //     {
  //       test: /alfred\.const\.js/i,
  //       loader: 'string-replace-loader',
  //       options: {
  //         multiple: [
  //           {
  //             search: "@@al",
  //             replace: 'http://192.168.50.128:5005',
  //             strict: true,
  //           },
  //           {
  //             search: "@@gw",
  //             replace: 'http://192.168.50.128:3000',
  //             strict: true,
  //           },
  //         ]
  //       }
  //     },

  //     // Transpiles chat ui module into ES5 for browser support
  //     {
  //       test: /\.js$/,
  //       exclude: /node_modules|src\/server\/index.*/i,
  //       use: {
  //         loader: "babel-loader",
  //         options: {
  //           presets: [
  //             [ "@babel/preset-env", {
  //               targets: {
  //                 chrome: "74",
  //                 firefox: "60",
  //                 ie: "11"
  //               },
  //             } ]
  //           ],
  //           plugins: [
  //             // Apply class props plugin
  //             "@babel/plugin-proposal-class-properties",
  //             // Apply promisify plugin
  //             "transform-util-promisify",
  //             // Add runtime plugin for use of regenerator
  //             [ "@babel/plugin-transform-runtime", {
  //               regenerator: true,
  //             } ]
  //           ]
  //         },
  //       }
  //     },

  //     // Transpile UI SASS
  //     {
  //       test: /\.s[c|a]ss$/i,
  //       exclude: /node_modules/i,
  //       use: [
  //         {
  //           loader: "style-loader"
  //         },
  //         {
  //           loader: "css-loader"
  //         }, 
  //         {
  //           loader: "sass-loader",
  //           options: {
  //             implementation: require( "sass" ),
  //           }
  //         }
  //       ]
  //     },

  //   ]
  // },

  // plugins: [
  //   // TODO: Add hot-reload plugin to gateway...
  //   // new webpack.HotModuleReplacementPlugin(),
    
  //   // Copy static assets from gateway directory into build
  //   new CopyPlugin([
  //     { from: 'src/gateway/', to: '../../gateway/', force: true },
  //   ]),

  //   // Inject alfred into static content
  //   ...generateHTMLPlugins(),

  //   // Used to limit assets to their specific pages
  //   new HtmlWebpackExcludeAssetsPlugin(),

  //   // Only clean gateway files
  //   new RemovePlugin({
  //     before: {
  //       root: 'build',
  //       include: [
  //         'gateway'
  //       ]
  //     },
  //   }),

  // ],

} );

module.exports = gatewayProdConfig;
