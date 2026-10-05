const n=`// Promise.all：并发执行多个异步操作，全部完成后返回
const delay = (label, ms) =>
  new Promise((resolve) => setTimeout(() => resolve(label), ms))

async function loadDashboard() {
  // 三个请求同时发出，总耗时 ≈ 最慢的那个（320ms）
  const results = await Promise.all([
    delay('课程', 220),
    delay('通知', 320),
    delay('进度', 160),
  ])

  console.log(results)  // ['课程', '通知', '进度']
}

loadDashboard()

// 其他组合器：
// Promise.allSettled — 等全部结束，不论成功失败
// Promise.race     — 返回最先完成的结果
// Promise.any      — 返回最先成功的结果
`;export{n as default};
