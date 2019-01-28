const path = require('path');
const slsw = require('serverless-webpack');

const config = {
  target: 'node',
  entry:  slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
  output: {
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    libraryTarget: 'commonjs'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            "presets": [
              [
                  "@babel/preset-env",
                  {
                      "useBuiltIns": "entry",
                  }
              ],
              "@babel/preset-react"
          ],
          "plugins": [
              ["@babel/plugin-proposal-class-properties", { "loose": false }]
          ]
          }
        }
      },
      { test: /\.hbs/, use: 'html-loader' },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true
            }
          },
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  externals: [
    'aws-sdk'
  ],
  devtool: 'source-map'
};

module.exports = config;