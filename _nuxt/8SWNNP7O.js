const n=`@use "sass:meta";

$brand: #c45125;
$font-stack: "Noto Serif SC", serif;

:root {
  --brand: #{$brand};
  --font-display: #{meta.inspect($font-stack)};
}

.title { color: var(--brand); font-family: var(--font-display); }
// 自定义属性在浏览器运行时继承、级联并可被 JavaScript 更新。
`;export{n as default};
