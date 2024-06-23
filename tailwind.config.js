module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust according to your file structure
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#FF00FF',
      },
      keyframes: {
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
      },
    },
  },
  plugins: [],
};
