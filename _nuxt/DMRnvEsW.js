const e=`// localStorage：关闭浏览器后数据仍然存在
localStorage.setItem('token', 'abc123')
const token = localStorage.getItem('token')

// sessionStorage：关闭标签页后数据清除
sessionStorage.setItem('currentPage', '2')

// 存储对象（需要 JSON 序列化）
const user = { name: '张三', role: 'admin' }
localStorage.setItem('user', JSON.stringify(user))
const saved = JSON.parse(localStorage.getItem('user'))

// 遍历所有键值
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i)
  console.log(key, localStorage.getItem(key))
}

// 删除与清空
localStorage.removeItem('token')
localStorage.clear()

// 监听其他标签页的存储变化
window.addEventListener('storage', (event) => {
  console.log('键', event.key, '从', event.oldValue, '变为', event.newValue)
})

// IndexedDB：大容量结构化存储
const request = indexedDB.open('CourseDB', 1)
request.onupgradeneeded = (e) => {
  const db = e.target.result
  if (!db.objectStoreNames.contains('courses')) {
    db.createObjectStore('courses', { keyPath: 'id' })
  }
}
request.onsuccess = (e) => {
  const db = e.target.result
  const tx = db.transaction('courses', 'readwrite')
  tx.objectStore('courses').put({ id: 1, title: 'Vue3 基础' })
}
`;export{e as default};
