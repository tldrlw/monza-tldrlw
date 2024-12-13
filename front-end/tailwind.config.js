/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    listStyleType: {
      square: "square",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customOrangeLogo: "#FF511A",
      },
    },
  },
  plugins: [],
};
