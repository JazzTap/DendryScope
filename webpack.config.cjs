const path = require('path');

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
	publicPath: ""
    },
    plugins: [
    ],
    experiments: {
        // outputModule: true,
    },
    module: {
        rules: [
   	    {
	       test: /\.js$/,
	       loader: require.resolve("@open-wc/webpack-import-meta-loader")
	     },
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
};

module.exports = () => {
    config.mode = 'development';
    // config.mode = 'production';
    return config;
};
