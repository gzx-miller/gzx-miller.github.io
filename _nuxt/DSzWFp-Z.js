const n=`/* static：默认定位，正常文档流 */
.static-box {
  position: static;
  /* top/right/bottom/left 不生效 */
}

/* relative：相对自身原位置偏移 */
.relative-box {
  position: relative;
  top: 10px;
  left: 20px;
  /* 相对原位置向下 10px，向右 20px */
  /* 仍占据原文档流位置 */
}

/* absolute：相对最近的非 static 祖先定位 */
.absolute-box {
  position: absolute;
  top: 0;
  right: 0;
  /* 相对于最近定位祖先的右上角 */
  /* 脱离文档流，不占空间 */
}

/* 父容器设置 relative 作为定位参考 */
.parent-relative {
  position: relative;
}

/* fixed：相对于视口定位 */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* 固定在视口顶部 */
  /* 脱离文档流 */
  z-index: 1000;
}

/* sticky：滚动时切换 fixed */
.sticky-nav {
  position: sticky;
  top: 0;
  /* 滚动到顶部时吸顶 */
  /* 必须指定 top/left 等才生效 */
  background: #fff;
}`;export{n as default};
