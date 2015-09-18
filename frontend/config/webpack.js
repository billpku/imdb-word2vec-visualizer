module.exports = function(env = null) {
  return Object.assign({}, {
    entry: {
      application: './client.js'
    },
    module: {
      loaders: [
        {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
      ]
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js',
      pathinfo: true
    }
  }, env && require(`./webpack/${env}`));
};