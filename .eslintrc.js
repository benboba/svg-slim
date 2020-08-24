module.exports = {
	extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
	],
	plugins: ['@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		ecmaVersion: 11,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
			modules: true,
		},
		tsconfigRootDir: __dirname,
	},
	env: {
		browser: true,
		node: true,
		commonjs: true,
		es6: true,
	},
	root: true,
	rules: {
		'indent': [2, 'tab', {
            'SwitchCase': 1,
        }],
        'quotes': [2, 'single'],
        'semi': [2, 'always'],
        'eol-last': 2,
        '@typescript-eslint/explicit-module-boundary-types': 0,
	},
};
