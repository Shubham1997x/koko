const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  // Get API URL from environment variable or use defaults
  // Priority: process.env.VET_CHATBOT_API_URL > default based on mode
  const API_URL = process.env.VET_CHATBOT_API_URL || 
    (isProduction ? 'https://koko-oe38.onrender.com' : 'http://localhost:3000');

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'chatbot.js',
      library: 'VetChatbot',
      libraryTarget: 'umd',
      globalObject: 'this',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    plugins: [
      // Inject environment variables
      new webpack.DefinePlugin({
        'process.env.VET_CHATBOT_API_URL': JSON.stringify(API_URL),
      }),
      // Generate HTML file for both development and production
      new HtmlWebpackPlugin({
        template: './public/index.html',
        inject: 'body',
        filename: 'index.html',
        templateParameters: {
          apiUrl: API_URL,
        },
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      port: 5173,
      hot: true,
      open: true,
    },
    externals: isProduction ? {
      // Don't bundle React in production - assume it might be available
      // For a standalone SDK, we'll bundle React
    } : {},
  };
};

