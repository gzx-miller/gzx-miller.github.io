const n=`/* BEM：Block-Element-Modifier */

/* Block：块（组件） */
.card {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

/* Element：元素（块的子部分，用 __ 连接） */
.card__header {
  margin-bottom: 12px;
}
.card__title {
  font-size: 18px;
  font-weight: 600;
}
.card__body {
  color: #666;
  line-height: 1.6;
}
.card__footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

/* Modifier：修饰符（状态/变体，用 -- 连接） */
.card--featured {
  border-color: #e8590c;
  background: #fff4e6;
}
.card--large {
  padding: 24px;
}
.card__title--highlight {
  color: #e8590c;
}

/* OOCSS：面向对象 CSS，分离结构与皮肤 */

/* 结构（布局） */
.media {
  display: flex;
  gap: 12px;
}
.media__img {
  flex-shrink: 0;
}
.media__body {
  flex: 1;
}

/* 皮肤（视觉） */
.media--dark {
  background: #333;
  color: #fff;
}
.media--bordered {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
}

/* SMACSS：分类组织 */

/* Base：基础样式（重置、默认） */
/*
body { margin: 0; }
a { color: #e8590c; }
*/

/* Layout：布局（前缀 l-） */
.l-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}
.l-grid {
  display: grid;
  gap: 16px;
}

/* Module：模块（组件） */
/* .btn { ... } */

/* State：状态（前缀 is-） */
.is-active {
  display: block;
}
.is-hidden {
  display: none;
}
.is-disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* Theme：主题 */
/* .theme-dark { ... } */`;export{n as default};
