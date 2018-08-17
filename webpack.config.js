'use strict';

const path = require('path');
const fs = require('fs');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const nodeModules = {};
fs.readdirSync('node_modules').filter(function (x) {
	return ['.bin'].indexOf(x) === -1;
}).forEach(function (mod) {
	nodeModules[mod] = 'commonjs ' + mod;
});

const srcpath = path.resolve('src');
const rootpath = path.resolve('.');
const distpath = path.resolve('dist');

const filename_extra = process.env.NODE_ENV === 'production' ? '.min' : '';
const entry = {
	'dist/svg-slimming': `${srcpath}/slimming/app.ts`,
	'dist/xml-parser': `${srcpath}/xml-parser/app.ts`,
};
if (process.env.NODE_ENV === 'development') {
	entry['test/config'] = `${srcpath}/slimming/config/config.ts`
}

module.exports = {
	mode: process.env.NODE_ENV,
	externals: nodeModules,
	entry,
	resolve: {
		extensions: ['.ts', '.tsx', '.d.ts', '.js', '.es']
	},
	output: {
		path: rootpath,
		filename: `[name]${filename_extra}.js`,
		library: 'svg-slimming',
		libraryTarget: 'umd',
	},
	target: 'node',
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'tslint-loader',
				exclude: /node_modules/,
				options: {
					failOnHint: true,
					typeCheck: true,
					noUnusedExpression: true,
					noUnusedVariable: true,
				}
			}, {
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			},
		]
	},
	plugins: [
		new CopyWebpackPlugin([
			{ from: path.resolve('README.md'), to: distpath }
		])
	],
	optimization: {
		minimizer: [
			new UglifyJSPlugin({
				uglifyOptions: {
					ecma: 8,
					compress: {
						warnings: false,
						collapse_vars: true,
						reduce_vars: true,
					},
					output: {
						beautify: false,
						comments: false,
					}
				}
			}),
		],
	}
};
