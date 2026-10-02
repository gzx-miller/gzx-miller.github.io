const n=`/* calc()：四则运算，支持混合单位 */
.calc-width {
  width: calc(100% - 32px);
  /* 父容器宽度减去 32px 内边距 */
}

/* calc()：变量运算 */
:root {
  --gap: 16px;
  --cols: 3;
}
.calc-col {
  width: calc((100% - var(--gap) * (var(--cols) - 1)) / var(--cols));
}

/* min()：取最小值（相当于 max-width） */
.min-width {
  width: min(90%, 1200px);
  /* 小屏用 90%，大屏最大 1200px */
}

/* max()：取最大值（相当于 min-width） */
.max-font {
  font-size: max(14px, 1.5vw);
  /* 最小 14px，随视口增长 */
}

/* clamp()：最小值、理想值、最大值 */
.clamp-font {
  font-size: clamp(14px, 2vw, 24px);
  /* 最小 14px，理想 2vw，最大 24px */
}

/* clamp() 响应式间距 */
.clamp-spacing {
  padding: clamp(16px, 4vw, 48px);
}

/* 嵌套使用 */
.nested-math {
  width: min(max(300px, 50%), 600px);
  /* 最小 300px，理想 50%，最大 600px */
}

/* 与 CSS 变量配合 */
.dynamic-layout {
  --content-max: 80ch;
  --content-width: min(100% - 2rem, var(--content-max));
  width: var(--content-width);
  margin-inline: auto;
}`;export{n as default};
