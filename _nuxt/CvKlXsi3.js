const n=`@import "tailwindcss";

/* 自动检测之外的显式源；路径相对当前样式表 */
@source "../shared-ui";
@source not "../legacy";

/* 仅在无法修改外部源码时内联完整候选，不要拼接碎片。 */
@source inline("underline");

/* 生产构建启用压缩，并检查输出 CSS 与缓存策略。 */
`;export{n as default};
