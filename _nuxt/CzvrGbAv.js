const n=`/* clip-path：圆形裁剪 */
.clip-circle {
  clip-path: circle(50% at center);
  /* 半径 50%，中心为圆心 */
}

/* clip-path：椭圆裁剪 */
.clip-ellipse {
  clip-path: ellipse(50% 40% at 50% 50%);
  /* 水平半径 50%，垂直半径 40% */
}

/* clip-path：多边形裁剪（三角形） */
.clip-triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  /* 顶点坐标列表 */
}

/* clip-path：多边形裁剪（六边形） */
.clip-hexagon {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

/* clip-path：圆角矩形（inset） */
.clip-inset {
  clip-path: inset(10px round 8px);
  /* 四周内边距 + 圆角 */
}

/* 动画 clip-path */
.clip-anim {
  clip-path: circle(10% at center);
  transition: clip-path 0.5s ease;
}
.clip-anim:hover {
  clip-path: circle(50% at center);
}

/* mask 遮罩：用图像/渐变的透明度决定可见性 */
.mask-gradient {
  -webkit-mask: linear-gradient(to bottom, black 0%, transparent 100%);
  mask: linear-gradient(to bottom, black 0%, transparent 100%);
  /* 顶部不透明，底部渐隐 */
}

/* mask：径向渐变遮罩 */
.mask-radial {
  -webkit-mask: radial-gradient(circle, black 60%, transparent 100%);
  mask: radial-gradient(circle, black 60%, transparent 100%);
  /* 中心显示，边缘渐隐 */
}

/* 注意：clip-path 裁剪区域无法接收点击事件 */
/* mask 需要 -webkit-mask 前缀兼容 Safari */`;export{n as default};
