/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#E8F5E9',
        primary: '#009688',
        primaryHover: '#00796B',
        text: {
          header: '#333333',
          body: '#666666',
        },
        gray: {
          150: '#EBEEF1', // Custom gray-150 color
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 2px 4px rgba(0,0,0,0.1)',
        medium: '0 4px 6px rgba(0,0,0,0.1)',
      }
    },
  },
  plugins: [],
}