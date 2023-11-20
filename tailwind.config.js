/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html',
              'script.js',
              './node_modules/flowbite/**/*.js'
],
  theme: {
    screens: { 
      sm: '360px',
      md: '640px',
      lg: '980px',
      xl: '1500px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
    },
    fontFamily: {
      mono: ['monospace', 'ui-monospace'],
      serif: ['Merriweather','serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: ['flowbite/plugin'],
}

