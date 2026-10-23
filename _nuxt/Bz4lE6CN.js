const n=`/* design-system.css —— 共享主题，发布为 npm 包或直接复制 */
@import "tailwindcss";

@theme {
  /* 颜色令牌 */
  --color-brand-50: #fff7ed;
  --color-brand-100: #ffedd5;
  --color-brand-500: #f97316;
  --color-brand-600: #ea580c;
  --color-brand-700: #c2410c;
  --color-neutral-900: #1c1917;
  --color-neutral-500: #78716c;

  /* 字体令牌 */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* 间距基准：4px，p-1 / p-2 等按倍自动生成 */
  --spacing: 0.25rem;

  /* 圆角令牌 */
  --radius-4xl: 2rem;

  /* 动画令牌 */
  --animate-fade-in: fade-in 0.3s ease-out;
  --animate-slide-up: slide-up 0.3s ease-out;

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slide-up {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
}

/* app.css —— 项目层引入共享主题，只写差异 */
@import "tailwindcss";
@import "@company/tailwind-theme/design-system.css";

@theme {
  --color-project-accent: #8b5cf6;
}

/* v3 写法（仅作迁移对照）：
   令牌抽成 preset 包，在 tailwind.config.js 的 presets 数组中引入；
   v4 不再自动读取 tailwind.config.js，需在 CSS 里用 @config 显式加载。 */
`;export{n as default};
