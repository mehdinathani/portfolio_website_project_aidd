/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        foreground: '#f5f5f7',
        primary: '#70ffd8',
        'primary-foreground': '#000000',
        secondary: '#040404',
        'secondary-foreground': '#e2e8f0',
        muted: '#6e6e73',
        'muted-foreground': '#6e6e73',
        accent: '#70ffd8',
        'accent-foreground': '#000000',
        mint: '#70ffd8',
        'mint-light': '#a8ffe8',
        teal: '#2dd4bf',
        'teal-deep': '#14b8a6',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        border: 'rgba(255, 255, 255, 0.08)',
        input: 'rgba(255, 255, 255, 0.08)',
        ring: '#70ffd8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '88rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee 30s linear infinite reverse',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'logo-flow': 'logo-gradient-flow 8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'logo-gradient-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}