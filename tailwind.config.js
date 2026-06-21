/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand / design tokens extracted from the Figma file
        brand: {
          DEFAULT: '#4E2FD2', // primary purple (prices, buttons, active)
          dark: '#0046C7', // plan shield blue
        },
        ink: {
          DEFAULT: '#1F1F1F', // primary heading text
          900: '#0B0D10', // strong body text (review names)
          700: '#484848', // step labels
          gray: '#575757', // card active price / stepper icon
        },
        muted: '#6F7882', // strike-through / secondary
        subhead: '#A8B2BD', // review category subheadings
        line: '#CED6DE', // dividers / borders
        panel: '#EDF4FF', // light lavender section background
        success: '#0AA288', // savings / shipping green
        sale: '#D8392B', // card compare-at strike (red)
        chip: {
          border: '#CCCCCC', // inactive color-chip border
          active: '#0AA288', // active color-chip border
        },
        stepper: {
          bg: '#F0F4F7', // plus-button background
          icon: '#525963', // active stepper icon
          disabled: '#F1F1F2', // disabled stepper bg
        },
      },
      fontFamily: {
        // Gilroy is the design's brand face. Drop the .woff2 files into
        // src/assets/fonts (see index.css). Falls back to a geometric sans.
        gilroy: ['Gilroy', 'Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
      maxWidth: {
        builder: '768px',
        review: '399px',
      },
    },
  },
  plugins: [],
};
