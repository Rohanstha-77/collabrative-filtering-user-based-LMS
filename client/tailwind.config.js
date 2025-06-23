/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // for App Router support
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          light: '#A5B4FC',
        },
        neutral: {
          background: '#F9FAFB',
          surface: '#FFFFFF',
          border: '#E5E7EB',
          text: '#1F2937',
          textSecondary: '#6B7280',
        },
      },
    },
  },
  plugins: [],
};
