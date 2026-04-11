import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        zen: {
          50: '#f7f7f5',
          100: '#ededea',
          200: '#d9d9d3',
          300: '#c0bfb4',
          400: '#a5a393',
          500: '#918f7e',
          600: '#848272',
          700: '#6e6c5f',
          800: '#5c5a50',
          900: '#4d4b44',
          950: '#292824',
        },
      },
    },
  },
  plugins: [],
}

export default config
