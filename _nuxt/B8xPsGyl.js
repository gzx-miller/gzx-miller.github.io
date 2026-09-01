const n=`.lesson-card {
  &:hover { transform: translateY(-2px); }
  &:focus-visible { outline: 2px solid currentColor; }
  &--featured { border-color: #c45125; }
  [dir="rtl"] & { text-align: right; }
}

$component: "progress";
.#{$component}__bar { transition: inline-size 200ms; }
// 动态选择器会降低全文搜索、静态分析和重构能力。
`;export{n as default};
