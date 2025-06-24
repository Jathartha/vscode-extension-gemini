const path = require('path');

module.exports = {
    entry: './src/webview/index.tsx',
    target: 'web',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'out/compiled'),
        filename: 'webview.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    externals: {
        vscode: 'commonjs vscode',
    },
}; 