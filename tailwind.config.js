/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html',
              'script.js',
              './node_modules/flowbite/**/*.js'
],
  theme: {
    extend: {},
  },
  plugins: ['flowbite/plugin'],
}

