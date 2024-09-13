/** @type {import('static/tailwinds.css').Config} */
module.exports = {
  content: ['../templates/**/*.{html,js}'],
  theme: {

    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      colors: {
        'blue': '#1fb6ff',
        'purple': '#7e5bef',
        'pink': '#ff49db',
        'orange': '#ff7849',
        'green': '#13ce66',
        'yellow': '#ffc82c',
        'gray-dark': '#273444',
        'gray': '#8492a6',
        'gray-light': '#d3dce6',
        'mechuli-yellow-10': '#FFF6CC',
        'mechuli-yellow-40': '#FFDD33',
        'mechuli-yellow-90': '#332A00',
        'mechuli-gray': '#E5E5E5',
      }
    }
  },
}