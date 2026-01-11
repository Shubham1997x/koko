const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

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
      // Only include HTML plugin in development for testing
      ...(isProduction ? [] : [
        new HtmlWebpackPlugin({
          template: './public/index.html',
          inject: 'body',
        }),
      ]),
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

