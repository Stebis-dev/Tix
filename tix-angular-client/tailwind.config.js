/** @type {import('tailwindcss').Config} */

// defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{html,js,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        'black-to-transparent': 'linear-gradient(to bottom, transparent, black)',
      },
      // fillHight:
      // {
      //   ''
      // }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        ntx_theme: {
          "primary": "#4A90E2",
          "secondary": "#2C2C2C",
          "accent": "#780101",
          "neutral": "#1E1E1E",
          "base-100": "#161616",

          "--tab-bg": "#161616"
          //   "--rounded-box": "1rem", // border radius rounded-box utility class, used in card and other large boxes
          //   "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
          //   "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
          //   "--animation-btn": "0.25s", // duration of animation when you click on button
          //   "--animation-input": "0.2s", // duration of animation for inputs like checkbox, toggle, radio, etc
          //   "--btn-focus-scale": "0.95", // scale transform of button when you focus on it
          //   "--border-btn": "1px", // border width of buttons
          //   "--tab-border": "1px", // border width of tabs
          //   "--tab-radius": "0.5rem", // border radius of tabs
        },
      },
    ],
    // themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    // darkTheme: "dark", // name of one of the included themes for dark mode
    // base: true, // applies background color and foreground color for root element by default
    // styled: true, // include daisyUI colors and design decisions for all components
    // utils: true, // adds responsive and modifier utility classes
    // prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    // logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    // themeRoot: ":root", // The elem
  },
}

