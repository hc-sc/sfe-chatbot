const 
  path = require('path'),
  webpack = require('webpack'),
  RemovePlugin = require('remove-files-webpack-plugin'),
  nodeExternals = require('webpack-node-externals'),
  WebpackSourceMapSupport = require("webpack-source-map-support");

/**
 * @constant {Object} serverConfig
 * @description Webpack config for the backend server components of the service gateway
 */
const serverConfig = {

  mode: 'development',

  devtool: '#source-map',

  entry: {
    server: [
      './src/server/index.dev',
    ],
  },

  output: {
    path: path.resolve( __dirname, 'build' ),
    publicPath: '/',
    filename: '[name].js'
  },

  target: 'node',

  node: {
    fs: "empty",
    readline: "empty",
    process: true,
    global: true,
    Buffer: false,
    setImmediate: false,
    __filename: false,
    __dirname: false,
  },

  externals: [
    nodeExternals( ) // Need this to avoid error when working with Express
  ], 

  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },

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
              "@babel/plugin-syntax-dynamic-import",
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

    // Apply sourcemap to development bundle
    new WebpackSourceMapSupport(),

    // TODO: Move HMR to dev config
    // Enable hot module replacement
    new webpack.HotModuleReplacementPlugin(),
    
    // Clean server files
    new RemovePlugin({
      before: {
        root: 'build',
        test: [
          {
            folder: './',
            method: path => /\.[js|html]/igm.test( path ),
          },
          {
            folder: './docs',
            method: path => /swagger/igm.test( path ),
          },
      ],
      },
    }),

  ],

};

module.exports = serverConfig;
