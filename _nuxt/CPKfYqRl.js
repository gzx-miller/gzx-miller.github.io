const n=`/* transition 过渡：需要状态变化触发 */
.btn {
  background: #e8590c;
  transition: background 0.3s ease, transform 0.2s ease-out;
  /* 过渡属性 + 时长 + 缓动函数 */
}
.btn:hover {
  background: #d9480f;
  transform: translateY(-2px);
}

/* transition 简写：property duration timing-function delay */
.card {
  transition: all 0.3s ease-in-out 0.1s;
}

/* 常用缓动函数 */
.ease-linear { transition-timing-function: linear; }
.ease-in { transition-timing-function: ease-in; }
.ease-out { transition-timing-function: ease-out; }
.ease-in-out { transition-timing-function: ease-in-out; }

/* @keyframes 关键帧动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 使用动画 */
.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
  /* 动画名 + 时长 + 缓动 + 填充模式 */
}

/* animation 完整属性 */
.spinner {
  animation: spin 1s linear infinite;
  /* 无限循环旋转 */
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 多阶段关键帧 */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}`;export{n as default};
