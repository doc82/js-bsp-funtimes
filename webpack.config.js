/* eslint-disable no-console */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

const env = process.env.NODE_ENV;
const dist = path.resolve(__dirname, './dist');

console.log(`Environment: ${process.env.NODE_ENV}`);

const webpackConfig = {
  devtool: env === 'production' ? 'source-map' : 'source-map',
  mode: env === 'production' ? 'production' : 'development',
  entry: [path.resolve(__dirname, './js/app/index.js')],
  output: {
    path: dist,
    filename: '[name].js',
    chunkFilename: '[id].[chunkhash].js'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  optimization: {
    runtimeChunk: 'single', // enable "runtime" chunk
    // emitOnErrors: true,
    minimize: false,
    minimizer: [],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(jsx|js)$/,
        include: path.resolve(__dirname, 'js'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: 'defaults'
                  }
                ],
                '@babel/preset-react'
              ],
              plugins: ['transform-class-properties']
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.ico$/,
        use: ['file-loader?name=[name].[ext]']
      },
      {
        test: /\.(svg|png|jpg)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, 'js/app/index.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true
      }
    }),
    // Load environment variables
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new WasmPackPlugin({
      crateDirectory: __dirname
    })
  ],
  devServer: {
    contentBase: dist,
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/
    },
    compress: true,
    port: 3000,
    open: true,
    historyApiFallback: true
  }
};

if (env != 'production') {
  webpackConfig.plugins.push(
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      include: /src/,
      failOnError: false,
      allowAsyncCycles: false,
      cwd: process.cwd()
    })
  );
}

module.exports = webpackConfig;
