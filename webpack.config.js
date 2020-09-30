var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        game: './src/canvas/game.ts'
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/canvas/game.html', to: 'index.html' },
                { from: 'src/canvas/game.css', to: 'game.css' },
                { from: 'src/assets', to: 'assets'}
            ]
        })
    ]
};
