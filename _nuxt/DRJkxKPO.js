const n=`$content-breakpoint: 35rem;

.layout {
  display: grid;
  gap: 1rem;

  @media (width >= $content-breakpoint) {
    grid-template-columns: 12rem minmax(0, 1fr);
  }
}
// Sass 会将嵌套媒体查询提升，并与外层查询合并。
`;export{n as default};
