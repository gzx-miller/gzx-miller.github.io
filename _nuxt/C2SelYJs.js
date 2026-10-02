const n=`// tailwind.design-system-preset.js （预设包，可发布为 npm 包）
export default {
  // 设计令牌：颜色
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },

      // 字体
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      // 间距
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },

      // 圆角
      borderRadius: {
        '4xl': '2rem',
      },

      // 动画
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },

  // 预设可以嵌套其他预设
  presets: [
    // require('@company/tailwind-tokens-preset'),
  ],

  // 预设也可以包含插件
  plugins: [
    // require('@tailwindcss/typography'),
  ],
}

// ========== 项目中使用 ==========
// tailwind.config.js
import designSystemPreset from './tailwind.design-system-preset'

export default {
  // 引入设计系统预设
  presets: [designSystemPreset],

  // 项目层可以覆盖或扩展预设
  theme: {
    extend: {
      // 项目特有颜色
      colors: {
        'project-accent': '#8b5cf6',
      },
    },
  },

  // 项目特有插件
  plugins: [],

  // 内容源路径（项目级，不会被预设覆盖）
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
}`;export{n as default};
