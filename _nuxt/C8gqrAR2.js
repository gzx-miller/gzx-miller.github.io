const n=`/* 动画性能：优先使用 GPU 加速属性 */

/* 高性能动画：transform + opacity */
.smooth-animation {
  transition: transform 0.3s ease, opacity 0.3s ease;
  /* 只触发合成，不触发重排/重绘 */
}
.smooth-animation:hover {
  transform: translateY(-4px) scale(1.02);
  opacity: 0.9;
}

/* 避免在动画中使用这些属性（会触发重排） */
/*
.bad-anim {
  transition: width 0.3s, height 0.3s, margin 0.3s, top 0.3s;
}
*/

/* will-change：提前告知浏览器哪些属性会变化 */
.will-change {
  will-change: transform, opacity;
  /* 不要滥用，会增加 GPU 内存 */
}

/* content-visibility：跳过离屏元素渲染 */
.long-list-item {
  content-visibility: auto;
  /* 离屏时跳过渲染，大幅提升长列表性能 */
  contain-intrinsic-size: 200px;
  /* 预估高度，避免滚动条跳动 */
}

/* contain：限制渲染范围 */
.contain-strict {
  contain: strict;
  /* 等价于 size layout style paint */
  /* 告诉浏览器这个元素的变化不影响外部 */
}

/* 减少渲染阻塞 */
/* <link rel="preload" href="critical.css" as="style"> */
/* <link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'"> */

/* 选择器优化：避免过深嵌套 */
/* 不好：嵌套过深 */
/*
.page .content .list .item .link { ... }
*/
/* 好：直接用类名 */
.list-item__link {
  color: #e8590c;
}

/* 避免使用通配选择器和属性选择器作为关键选择器 */
/* 不好 */
/* div [class*="btn"] { ... } */
/* 好 */
.btn {
  padding: 8px 16px;
}

/* 减少重排：批量修改样式 */
/* 用 class 切换代替逐属性修改 */
.box {
  transition: all 0.3s;
}
.box--active {
  width: 200px;
  padding: 20px;
  margin: 10px;
}

/* 使用 font-display 避免 FOIT */
/*
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}
*/`;export{n as default};
