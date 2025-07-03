/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    // Dynamic color classes used in components
    'text-blue-600', 'text-green-600', 'text-purple-600', 'text-yellow-600', 'text-indigo-600', 'text-emerald-600', 'text-red-600',
    'bg-blue-50', 'bg-green-50', 'bg-purple-50', 'bg-yellow-50', 'bg-indigo-50', 'bg-emerald-50', 'bg-red-50',
    'bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-yellow-100', 'bg-indigo-100', 'bg-emerald-100', 'bg-red-100',
    'bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-yellow-200', 'bg-indigo-200', 'bg-emerald-200', 'bg-red-200',
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-red-500',
    'border-blue-200', 'border-green-200', 'border-purple-200', 'border-yellow-200', 'border-indigo-200', 'border-emerald-200', 'border-red-200',
    'text-blue-800', 'text-green-800', 'text-purple-800', 'text-yellow-800', 'text-indigo-800', 'text-emerald-800', 'text-red-800',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        medicaid: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
      }
    },
  },
  plugins: [],
}