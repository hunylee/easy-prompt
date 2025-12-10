/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          blue: '#007AFF',
          gray: '#F2F2F7',
          background: '#FFFFFF',
        },
        android: {
          primary: '#6750A4',
          background: '#FFFBFE',
          surface: '#E7E0EC',
        }
      },
      fontFamily: {
        ios: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        android: ['Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
