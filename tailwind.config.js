module.exports = {
	content: ['index.html', 'src/client/**/*.tsx'],
	theme: {
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
		},
		extend: {},
	},
	plugins: [require('@tailwindcss/forms')],
};
