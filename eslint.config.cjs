module.exports = [
	{
		ignores: ['public/**', 'node_modules/**', 'docs/**', '.github/**'],
	},
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'commonjs',
		},
		rules: {
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		},
	},
];