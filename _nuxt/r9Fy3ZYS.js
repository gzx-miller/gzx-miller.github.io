const n=`/* Grid 容器：启用网格布局 */
.grid-container {
  display: grid;
  gap: 16px;
}

/* 定义列轨道 */
.grid-cols-3 {
  grid-template-columns: 1fr 1fr 1fr;
  /* 三等分列 */
}
.grid-cols-auto {
  grid-template-columns: repeat(3, minmax(100px, 1fr));
  /* 每列最小 100px，最大平分 */
}

/* 定义行轨道 */
.grid-rows-2 {
  grid-template-rows: auto 1fr;
  /* 第一行自适应，第二行占剩余 */
}

/* 区域命名布局 */
.grid-areas {
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
.grid-areas .header { grid-area: header; }
.grid-areas .sidebar { grid-area: sidebar; }
.grid-areas .main { grid-area: main; }
.grid-areas .footer { grid-area: footer; }

/* 网格线放置项目 */
.item-span {
  grid-column: 1 / 3;
  /* 从第 1 列线到第 3 列线（跨 2 列） */
  grid-row: span 2;
  /* 跨 2 行 */
}

/* 自动填充 */
.grid-auto-fill {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  /* 自动填充，每列至少 200px */
}`;export{n as default};
