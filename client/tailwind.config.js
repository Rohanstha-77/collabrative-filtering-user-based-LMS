/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // if you're using the new App Router
  ],
 theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5", // Main Primary Color
          hover: "#4338CA",  // Darker shade for hover states
          light: "#A5B4FC",  // Lighter shade for highlights or accents
        },
        neutral: {
          background: "#F9FAFB",
          surface: "#FFFFFF",
          border: "#E5E7EB",
          text: "#1F2937",
          textSecondary: "#6B7280",
        },
      },
    },
  },
  plugins: [],
};
