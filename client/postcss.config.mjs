// /** @type {import('tailwindcss').Config} */
// const config = {
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx}", // Scan pages for Tailwind classes
//     "./components/**/*.{js,ts,jsx,tsx}", // Scan components for Tailwind classes
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           DEFAULT: "#4F46E5", // Main Primary Color
//           hover: "#4338CA",  // Darker shade for hover states
//           light: "#A5B4FC",  // Lighter shade for highlights or accents
//         },
//         neutral: {
//           background: "#F9FAFB",
//           surface: "#FFFFFF",
//           border: "#E5E7EB",
//           text: "#1F2937",
//           textSecondary: "#6B7280",
//         },
//       },
//     },
//   },
//   plugins: ["@tailwindcss/postcss"],
// };

// export default config;

const config = {
   plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config