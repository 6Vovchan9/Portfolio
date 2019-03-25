const path = require ("path");
const webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
    entry: {
        index: './src/index.js'
    },
    mode: 'development',
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].[hash].build.js",
        chunkFilename: "[chunkhash].js"
    }
}