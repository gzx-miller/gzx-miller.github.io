<script setup lang="ts">
import { ref } from 'vue'

interface Announcement {
  id: number
  content: string
  roomId: string
  time: string
}

const roomId = ref('classroom-1')
const memberName = ref('小栗')
const announcementText = ref('')

const messages = ref<Announcement[]>([])
const onlineCount = ref(0)
const joined = ref(false)
const logs = ref<string[]>([])

function joinRoom() {
  if (!memberName.value.trim()) return
  joined.value = true
  onlineCount.value++
  logs.value = []
  logs.value.push(`📡 客户端发送 joinRoom → { roomId: '${roomId.value}', name: '${memberName.value}' }`)
  logs.value.push(`🎯 Gateway.handleJoinRoom：socket.join('${roomId.value}')`)
  logs.value.push(`📢 向房间广播 joined 事件，当前在线 ${onlineCount.value} 人`)
  messages.value.unshift({
    id: Date.now(),
    content: `${memberName.value} 加入了课堂`,
    roomId: roomId.value,
    time: new Date().toLocaleTimeString(),
  })
}

function sendAnnouncement() {
  if (!announcementText.value.trim()) return
  logs.value.push(`📡 讲师发送 announce → { roomId: '${roomId.value}', content: '${announcementText.value}' }`)
  logs.value.push(`📢 Gateway.handleAnnounce：client.to('${roomId.value}').emit('announcement')`)
  messages.value.unshift({
    id: Date.now(),
    content: announcementText.value,
    roomId: roomId.value,
    time: new Date().toLocaleTimeString(),
  })
  announcementText.value = ''
}

function leaveRoom() {
  joined.value = false
  onlineCount.value = Math.max(0, onlineCount.value - 1)
  logs.value.push(`🔌 客户端断开（handleDisconnect）：房间在线 ${onlineCount.value} 人`)
}
</script>

<template>
  <div class="demo-card">
    <h3>🌰 实时课堂 · WebSocket 网关与房间广播</h3>
    <p style="color: var(--muted); margin-bottom: 12px">
      模拟 <code>ClassroomGateway</code>：学员 join 房间，讲师发公告广播给房间内所有人：
    </p>

    <div class="ws-box">
      <div class="ws-row">
        <label>房间
          <input v-model="roomId" type="text" :disabled="joined" />
        </label>
        <label>昵称
          <input v-model="memberName" type="text" :disabled="joined" />
        </label>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <button v-if="!joined" class="tab-btn active" @click="joinRoom">加入房间</button>
        <template v-else>
          <input
            v-model="announcementText"
            type="text"
            class="announce-input"
            placeholder="输入公告内容，按回车广播"
            @keydown.enter="sendAnnouncement"
          />
          <button class="tab-btn active" @click="sendAnnouncement">发送公告</button>
          <button class="tab-btn" @click="leaveRoom">离开</button>
        </template>
      </div>
      <p class="online-tag">🟢 房间在线：<strong>{{ onlineCount }}</strong> 人</p>
    </div>

    <div v-if="logs.length" class="ws-log">
      <p v-for="(log, i) in logs" :key="i" class="ws-line">{{ log }}</p>
    </div>

    <div v-if="messages.length" class="msg-list">
      <div v-for="msg in messages" :key="msg.id" class="msg-item">
        <span class="msg-badge">📢</span>
        <div class="msg-body">
          <p class="msg-content">{{ msg.content }}</p>
          <p class="msg-meta">room: {{ msg.roomId }} · {{ msg.time }}</p>
        </div>
      </div>
    </div>

    <p class="note">
      <strong>房间隔离：</strong><code>socket.join(roomId)</code> 加入房间，
      <code>client.to(roomId).emit()</code> 只向该房间广播——其它课堂互不干扰。
    </p>
  </div>
</template>

<style scoped>
.ws-box {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg);
  margin-bottom: 10px;
}

.ws-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.ws-row label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
}

.ws-row input,
.announce-input {
  padding: 7px 10px;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 13px;
}

.announce-input {
  flex: 1;
  min-width: 180px;
}

.ws-row input:focus,
.announce-input:focus {
  outline: none;
  border-color: var(--accent);
}

.online-tag {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--muted);
}

.online-tag strong {
  color: var(--forest);
}

.ws-log {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px dashed var(--border);
  background: var(--surface);
  margin-bottom: 10px;
}

.ws-line {
  margin: 4px 0;
  font-size: 12px;
  color: var(--text);
  font-family: Consolas, Menlo, monospace;
}

.msg-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.msg-item {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  background: var(--surface-soft);
}

.msg-badge {
  flex: none;
}

.msg-content {
  margin: 0;
  font-size: 13px;
  color: var(--text);
}

.msg-meta {
  margin: 2px 0 0;
  font-size: 11px;
  color: var(--muted);
}

.note {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
}
</style>
