const
  merge = require('webpack-merge'),
  RemovePlugin = require('remove-files-webpack-plugin'),
  common = require("./webpack.server.common.js");

/**
 * @constant {Object} serverConfig
 * @description Webpack config for the backend server components of the service gateway
 */
const serverProdConfig = merge.strategy({
  entry: 'replace',
  mode: 'replace',
  devtool: 'replace',
  watchOptions: 'replace',
  'module.rules': 'replace',
  optimization: 'replace',
  plugins: 'replace',
})( common, {

  mode: 'production',

  devtool: 'hidden-source-map',

  entry: {
    server: [
      './src/server/index'
    ],
  },

  watchOptions: { },

  module: {

    rules: [

      // Transpile server for node
      {
        test: /\.js$/,
        exclude: /node_modules|src\/chat\/alfred.*/i,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [ "@babel/preset-env", {
                modules: 'commonjs',
                targets: {
                  node: "current",
                },
              } ]
            ],
            plugins: [
              "@babel/plugin-proposal-class-properties",
            ],
          },
        }
      },

      // Load YAML for API Docs
      {
        test: /\.(?:yaml)$/i,
        exclude: /node_modules|src\/chat\/alfred.*/i,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'docs',
          },
        },
      },

    ]
  },

  plugins: [
    
    // Clean server files
    new RemovePlugin({
      before: {
        root: 'build',
        test: [{
          folder: './',
          method: path => /\.[js|html]/igm.test( path ),
        }],
      },
    }),

  ],

  optimization: {
  
    minimize: true,

    mangleWasmImports: true,

  },

} );

module.exports = serverProdConfig;
