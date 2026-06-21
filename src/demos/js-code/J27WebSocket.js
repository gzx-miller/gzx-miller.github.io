// WebSocket：建立持久双向连接
const ws = new WebSocket('wss://example.com/ws')

ws.onopen = () => {
  // 连接建立后，可随时双向发送数据
  ws.send(JSON.stringify({ type: 'join', room: 'chat' }))
}

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('收到消息：', data)
}

ws.onclose = () => console.log('连接关闭')

// 发送消息
ws.send('Hello Server!')

// Server-Sent Events（服务端推送，单向）
const eventSource = new EventSource('/api/stream')

eventSource.onmessage = (event) => {
  console.log('收到推送：', event.data)
}

eventSource.addEventListener('update', (event) => {
  console.log('更新：', event.data)
})

// 关闭 SSE
eventSource.close()
