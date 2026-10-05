const n=`/* 在 :root 声明全局变量 */
:root {
  --primary-color: #e8590c;
  --primary-light: #fff4e6;
  --border-color: #ffd8a8;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --font-size-base: 14px;
  --border-radius: 6px;
}

/* 读取变量：var(变量名, 备用值) */
.btn {
  background: var(--primary-color);
  color: #fff;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
}

/* 局部变量：只在当前选择器及后代生效 */
.card {
  --card-padding: 20px;
  padding: var(--card-padding);
  border: 1px solid var(--border-color);
}

/* 备用值：变量不存在时使用 */
.text {
  color: var(--text-color, #333);
  /* --text-color 未定义时用 #333 */
}

/* 主题切换示例：冷色主题 */
.theme-cool {
  --primary-color: #1971c2;
  --primary-light: #e7f5ff;
  --border-color: #a5d8ff;
}

/* 计算中使用变量 */
.layout {
  --gutter: 16px;
  --cols: 3;
  --col-width: calc((100% - var(--gutter) * 2) / var(--cols));
}

/* JavaScript 动态修改变量 */
/* element.style.setProperty('--primary-color', '#000'); */`;export{n as default};
