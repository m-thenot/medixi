const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      body: '"Poppins", ui-sans-serif, system-ui',
      heading: '"Poppins", ui-sans-serif, system-ui',
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      orange: colors.orange,
      white: colors.white,
      gray: colors.gray,
      zinc: colors.zinc,
      slate: colors.slate,
      neutral: colors.neutral,
      red: colors.red,
      blue: colors.blue,
      green: colors.green,
      primary: {
        100: colors.blue[500],
        200: colors.blue[300],
      },
    },
  },
  corePlugins: {},
  plugins: [],
};
