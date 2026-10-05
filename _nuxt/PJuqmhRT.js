const n=`/* vw：视口宽度的百分比 */
.vw-full {
  width: 100vw;
  /* 始终等于视口宽度 */
}

/* vh：视口高度的百分比 */
.vh-full {
  height: 100vh;
  /* 注意：移动端工具栏会导致问题 */
}

/* dvh：动态视口高度（推荐移动端使用） */
.dvh-full {
  height: 100dvh;
  /* 工具栏收起/展开时动态调整，更准确 */
}

/* svh / lvh：最小/最大视口高度 */
.svh-height {
  height: 100svh;
  /* 小视口高度（工具栏展开时） */
}

/* vmin / vmax：视口较小/较大边的百分比 */
.vmin-square {
  width: 50vmin;
  height: 50vmin;
  /* 正方形，随视口较小边缩放 */
}

/* rem：相对于根元素字体大小 */
.rem-size {
  font-size: 1.5rem;
  /* 1.5 * 根字号（通常 16px = 24px） */
}
:root {
  font-size: 16px;
  /* 修改根字号可全局缩放 */
}

/* em：相对于当前元素字体大小 */
.em-padding {
  font-size: 16px;
  padding: 1em;
  /* 1em = 16px */
}

/* ch：字符 0 的宽度（约等于一个汉字宽度） */
.ch-measure {
  width: 60ch;
  /* 最佳阅读宽度约 60-75ch */
}

/* cqw / cqh：容器查询单位（相对于容器宽度/高度） */
/* 需配合 container-type 使用 */
.container {
  container-type: inline-size;
}
@container (min-width: 400px) {
  .card {
    font-size: 2cqw;
    /* 容器宽度的 2% */
  }
}

/* ex：x 高度（小写字母 x 的高度） */
.ex-valign {
  height: 2ex;
}`;export{n as default};
