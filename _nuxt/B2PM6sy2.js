const n=`// ═══════════════════════════════════════════
// 1. localStorage 与 sessionStorage 的生命周期
// ═══════════════════════════════════════════

localStorage.setItem('theme', 'dark')     // 持久保存，关闭浏览器仍在
sessionStorage.setItem('step', '2')       // 仅当前标签页，关闭即清空
localStorage.getItem('theme')             // 'dark'
sessionStorage.getItem('step')            // '2'
// 两者用法一致，差别只在生命周期：一个跨会话，一个以标签页为单位

// ═══════════════════════════════════════════
// 2. 只能存字符串，存对象要序列化
// ═══════════════════════════════════════════

localStorage.setItem('cart', { n: 1 })                  // 实际存成 "[object Object]"
localStorage.setItem('cart', JSON.stringify({ n: 1 }))  // 正确写法：先序列化
JSON.parse(localStorage.getItem('cart')).n             // 1   ← 读时再还原
localStorage.getItem('count')                          // '3' ← 数字存进去会变字符串

// ═══════════════════════════════════════════
// 3. storage 事件只在本页之外的标签页触发
// ═══════════════════════════════════════════

window.addEventListener('storage', (e) => {
  e.key        // 变化的键名，仅在“其他”同源标签页触发
  e.newValue   // 新值；写入数据的那一页自己收不到该事件
})
// 跨标签页同步：一边写、一边在别处监听，才能在另一个页面拉齐界面

// ═══════════════════════════════════════════
// 4. 超出配额抛出 QuotaExceededError
// ═══════════════════════════════════════════

try {
  localStorage.setItem('big', 'x'.repeat(5_000_000))
} catch (e) {
  e.name       // 'QuotaExceededError'  ← 写入超出存储配额
}
// 「存进去」不是必然成功，内容来自用户或接口时要用 try/catch 兜住

// ═══════════════════════════════════════════
// 5. localStorage 同步读写会阻塞主线程
// ═══════════════════════════════════════════

localStorage.setItem('cache', JSON.stringify(rows))   // 同步写，主线程被占住
// 几十字节无感，几万条记录再序列化就会卡顿
// 大数据量改用 IndexedDB：异步、基于事务，不阻塞主线程

// ═══════════════════════════════════════════
// 6. IndexedDB 的事务与对象仓库
// ═══════════════════════════════════════════

const db = await openDB('shop', 1)                     // 异步打开数据库
const tx = db.transaction('orders', 'readwrite')       // 三、一组操作放进事务
tx.objectStore('orders').put({ id: 1, total: 99 })     // 对象仓库写入
// 事务要么全成功、要么一起回滚，不会写到一半留下不一致
// 对象仓库可建索引、做范围查询，能力接近一个内嵌的小型数据库

// ═══════════════════════════════════════════
// 7. WebSocket 的 open / message / close / error
// ═══════════════════════════════════════════

const ws = new WebSocket('wss://example.com/chat')   // HTTP 升级握手后建立连接
ws.onopen = () => { /* 握手完成，通道建立 */ }
ws.onmessage = (e) => { e.data /* 服务端推来的数据帧 */ }
ws.onclose = () => { /* 连接关闭，需自行重连 */ }
ws.onerror = () => { /* 连接出错 */ }
ws.send('hello')                                     // 客户端可随时主动发送

// ═══════════════════════════════════════════
// 8. 生产环境的重连与心跳
// ═══════════════════════════════════════════

function scheduleReconnect() {
  setTimeout(connect, 1000)          // 断线后自行重连，间隔逐次加长防重连风暴
}
setInterval(() => ws.send('ping'), 30000)   // 定期心跳，确认通道仍然可用
// WebSocket 不会自动重连，这两件事必须自己补上

// ═══════════════════════════════════════════
// 9. SSE 是服务端单向推送，自带断线重连
// ═══════════════════════════════════════════

const es = new EventSource('/api/stream')   // 单向：仅服务端 → 客户端
es.onmessage = (e) => console.log(e.data)   // 断线后浏览器自动重连，无需自写
// 只需单向推送（进度、通知）选 SSE；需要双向频繁交互才用 WebSocket
`;export{n as default};
