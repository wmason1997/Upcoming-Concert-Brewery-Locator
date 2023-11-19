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
      'orange': '#a16737',
      'tan': '#bc9a71',
      'white': '#ccc0b2',
      'light grey': '#b3b2ad',
      'blue': '#506667',
      'brown': '#472c10',
    },
    fontFamily: {
      sans: ['graphik', 'snas-serif'],
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

