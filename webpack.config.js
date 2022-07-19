const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
const package = require('./package.json');

const config = {
  mode: 'production',
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, `dist/${package.name}`),
  },
  // devtool: 'inline-source-map',
  devServer: {
    // contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
      filename: 'index.html',
      title: '叠化'
    }),
    // new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    moduleIds: 'named'
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};

module.exports = config;