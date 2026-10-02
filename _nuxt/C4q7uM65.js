const n=`@use "sass:meta";

$length: 1rem;
$duration: 200ms;
$ratio: 1.5;
$palette: (brand: #c45125, surface: #fff8ed);

@debug meta.type-of($length); // number
@debug $length + 8px;          // Sass 会转换兼容单位
// $length + $duration 会报错：长度与时间不兼容。
`;export{n as default};
