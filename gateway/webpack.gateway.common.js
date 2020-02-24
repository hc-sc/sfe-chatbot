const
  path = require('path'),
  { sync } = require('glob'),
  webpack = require('webpack'),
  CopyPlugin = require('copy-webpack-plugin'),
  HTMLWebpackPlugin = require('html-webpack-plugin'),
  HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin'),
  RemovePlugin = require('remove-files-webpack-plugin');

/**
 * @constant {string[]} chunkOrder
 * @description Ordered array of intended chunk injection order
 */
const chunkOrder = [
  "polyfill",
  "search/gateway/global",
  "alfred",
  "search/gateway/ui",
  "search/software/ui",
];

/**
 * @function generateHTMLPlugins
 * @description Generates array of HTML Webpack Plugin instances for each HTML file under en/fr
 * @returns {Objet[]}
 */
const generateHTMLPlugins = ( pages = [
  ...sync( './src/gateway/en/**/*.html' ),
  ...sync( './src/gateway/fr/**/*.html' ),
] ) => 
  // Map list into plugin instances
  pages.map( template => new HTMLWebpackPlugin( {
    template,
    filename: template.replace( /\.\/src\/?/i, "../../" ),

    // Exclude search UI entries from all HTML except search pages
    excludeAssets: [

      // Gateway Search UI module
      .../(?:gateway.search.results)/ig.test( template )
        ? [ ]
        : [ /gateway.ui/i ],

      // Software Search UI module
      .../(?:s.get)/ig.test( template )
        ? [ ]
        : [ /software.ui/i ],

    ]
    /*   .filter( truthy => !!truthy ) */,

    // Sort chunks according to "chunkOrder"
    chunksSortMode: ( chunk1, chunk2 ) => {
      const pos = [
        chunkOrder.indexOf( chunk1.names[ 0 ] ),
        chunkOrder.indexOf( chunk2.names[ 0 ] ),
      ];

      return pos[ 0 ] > pos[ 1 ]
        ? 1
        : pos[ 0 ] < pos[ 1 ]
          ? -1
          : 0;
    },
  } ) );

/**
 * @constant {Object} gatewayConfig
 * @description Webpack config for the frontend web components of the service gateway
 */
const gatewayConfig = {

  mode: 'development',

  devtool: '#source-map',

  entry: {

    // Development scripts
    dev: [
      // Hot module reloading
      './src/dev/hmr',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
    ],

    // Polyfills
    polyfill: [
      'whatwg-fetch',
      '@babel/polyfill',
    ],

    // Chatbot
    alfred: [
      './src/chat/alfred',
      './src/chat/alfred.dev',
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

  output: {
    path: path.resolve( __dirname, 'build', 'gateway', 'gw-custom' ),
    publicPath: '../gw-custom',
    filename: '[name].min.js'
  },

  target: 'web',

  module: {

    rules: [

      // Transpiles chat ui module into ES5 for browser support
      {
        test: /\.js$/,
        exclude: /node_modules|src\/server\/index.*/i,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [ "@babel/preset-env", {
                targets: {
                  chrome: "74",
                  firefox: "60",
                  ie: "11"
                },
              } ]
            ],
            plugins: [
              // Apply class props plugin
              "@babel/plugin-proposal-class-properties",
              // Apply promisify plugin
              "transform-util-promisify",
              // Add runtime plugin for use of regenerator
              [ "@babel/plugin-transform-runtime", {
                regenerator: true,
              } ]
            ]
          },
        }
      },

      // Transpile UI SASS
      {
        test: /\.s[c|a]ss$/i,
        exclude: /node_modules/i,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          }, 
          {
            loader: "sass-loader",
            options: {
              implementation: require( "sass" ),
            }
          }
        ]
      },

    ]
  },

  plugins: [
    // TODO: Add hot-reload plugin to gateway...
    // new webpack.HotModuleReplacementPlugin(),
    
    // Copy static assets from gateway directory into build
    new CopyPlugin([
      { from: 'src/gateway/', to: '../../gateway/', force: true },
    ]),

    // Inject alfred into static content
    ...generateHTMLPlugins(),

    // Used to limit assets to their specific pages
    new HtmlWebpackExcludeAssetsPlugin(),

    // Only clean gateway files
    new RemovePlugin({
      before: {
        root: 'build',
        include: [
          'gateway'
        ]
      },
    }),

  ],

};

module.exports = gatewayConfig;
