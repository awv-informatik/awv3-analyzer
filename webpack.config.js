var path = require('path'),
    webpack = require('webpack'),
    production = require('yargs').argv.production;

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

    plugins: [
        new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }),
        new webpack.optimize.OccurrenceOrderPlugin(true),
    ].concat(production ? [
        new webpack.optimize.UglifyJsPlugin({ mangle: true, compress: { warnings: false } }),
    ] : []),

    devServer: { contentBase: './' },
    devtool: production ? undefined : 'source-map',
    cache: true,
    debug: !production,
};
