const n=`/* Flex 容器：启用弹性布局 */
.flex-container {
  display: flex;
  gap: 12px;
}

/* 主轴对齐方式 */
.justify-center {
  justify-content: center;
  /* 主轴居中 */
}
.justify-between {
  justify-content: space-between;
  /* 两端对齐，中间均匀分布 */
}
.justify-around {
  justify-content: space-around;
  /* 每个项目两侧间距相等 */
}

/* 交叉轴对齐方式 */
.align-center {
  align-items: center;
  /* 交叉轴居中 */
}
.align-stretch {
  align-items: stretch;
  /* 拉伸填满容器高度（默认） */
}
.align-baseline {
  align-items: baseline;
  /* 基线对齐 */
}

/* 换行设置 */
.flex-wrap {
  flex-wrap: wrap;
  /* 空间不足时换行 */
}

/* Flex 项目：弹性增长 */
.flex-grow {
  flex-grow: 1;
  /* 平分剩余空间 */
}

/* 改变排列顺序 */
.order-first {
  order: -1;
  /* 排在最前面 */
}

/* 简写：flex: grow shrink basis */
.flex-1 {
  flex: 1 1 0%;
  /* 常用简写：可伸缩 */
}`;export{n as default};
