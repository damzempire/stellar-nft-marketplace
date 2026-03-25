/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'stellar-blue': '#1a1a2e',
        'stellar-purple': '#16213e',
        'stellar-pink': '#e94560',
      },
    },
  },
  plugins: [],
}
