var path = require('path'),
    webpack = require('webpack');

module.exports = {
    entry: './index.js',

    output: {
        publicPath: '/',
        path: __dirname,
        filename: 'generated/bundle.js'
    },

    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
            { test: /\.vue$/, loader: 'vue' },
            { test: /\.json$/, loader: 'json' },
            { test: /\.html$/, loader: 'vue-html' },
            { test: /\.(png|jpg|gif|svg)$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            }]
    },

    devServer: { contentBase: './' },
    devtool: 'source-map'
};
