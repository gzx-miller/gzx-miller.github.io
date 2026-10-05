const n=`// _tokens.scss
$brand: #c45125;
$space-unit: 0.25rem;
$-internal-debug-color: magenta;

// card.scss
@use "tokens";
.card {
  color: tokens.$brand;
  padding: tokens.$space-unit * 4;
}
// 一个模块无论被 @use 多少次，都只执行并输出一次。
`;export{n as default};
