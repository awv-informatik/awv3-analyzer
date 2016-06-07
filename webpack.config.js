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
            { test: /\.vue$/, loader: 'vue', exclude: /node_modules/ },
            { test: /\.json$/, loader: 'json', exclude: /node_modules/ },
            { test: /\.html$/, loader: 'vue-html', exclude: /node_modules/ },
            { test: /\.(png|jpg|gif|svg)$/,
                loader: 'url',
                exclude: /node_modules/,
                query: { limit: 10000, name: '[name].[ext]?[hash]' }
            }],
    },

    vue: { loaders: { sass: "vue-style-loader!css-loader!sass?indentedSyntax" } },
    sassLoader: { includePaths: ['node_modules'] },

    plugins: [
        new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } })
    ].concat(production ? [
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.optimize.UglifyJsPlugin({ mangle: true, compress: { warnings: false } }),
    ] : []),

    devServer: { contentBase: './' },
    devtool: production ? undefined : 'source-map',
    cache: true,
    debug: !production,
};
