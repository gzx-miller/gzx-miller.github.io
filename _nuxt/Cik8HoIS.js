const n=`@use "sass:math";

@function column-width($container, $columns, $gap) {
  @if $columns < 1 { @error "$columns 必须大于 0"; }
  @return math.div($container - $gap * ($columns - 1), $columns);
}

.card { width: column-width(1000px, 3, 16px); }
// 需要浏览器上下文时保留 calc(100% - 2rem)，不要提前求值。
`;export{n as default};
