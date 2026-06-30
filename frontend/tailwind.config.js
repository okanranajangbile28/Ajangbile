/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		// screens: {
		// 	smallMobile: '300px',
		// 	tablet: '640px',
		// 	// => @media (min-width: 640px) { ... }

		// 	laptop: '1024px',
		// 	// => @media (min-width: 1024px) { ... }

		// 	desktop: '1280px',
		// 	// => @media (min-width: 1280px) { ... }
		// },
		extend: {
			fontFamily: {
				Manrope: ['Manrope', ...defaultTheme.fontFamily.sans],
				Roboto: ['Roboto', ...defaultTheme.fontFamily.sans],
				Open: ['Open Sans', ...defaultTheme.fontFamily.sans],
				Monda: ['Monda', ...defaultTheme.fontFamily.sans],
				Inter: ['Inter', ...defaultTheme.fontFamily.sans],
				DM: ['DM Sans', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	variants: {
		scrollbar: ['rounded'],
	},
	plugins: [
		require('tailwind-scrollbar'),
		require('tailwind-scrollbar')({ nocompatible: true }),
	],
};
