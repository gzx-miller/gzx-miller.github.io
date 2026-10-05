const n=`import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables'

const model = new ChatOpenAI({ model: 'gpt-4o-mini' })
const prompt = ChatPromptTemplate.fromTemplate(
  '用生动的语言描述{scene}，不少于200字'
)
const parser = new StringOutputParser()
const chain = prompt.pipe(model).pipe(parser)

// 示例1: invoke - 等待完整响应
async function demoInvoke() {
  console.log('=== invoke 方式 ===')
  const startTime = Date.now()
  
  const result = await chain.invoke({ scene: '春天的花园' })
  
  const duration = (Date.now() - startTime) / 1000
  console.log(\`等待时间: \${duration.toFixed(2)}秒\`)
  console.log(\`结果长度: \${result.length}字\`)
  console.log('完整结果:', result.slice(0, 100) + '...')
}

// 示例2: stream - 逐 token 流式输出
async function demoStream() {
  console.log('\\n=== stream 方式 ===')
  const startTime = Date.now()
  let firstTokenTime: number | null = null
  let tokenCount = 0
  let fullText = ''

  const stream = await chain.stream({ scene: '夏日海边' })

  for await (const chunk of stream) {
    if (!firstTokenTime) {
      firstTokenTime = Date.now()
      console.log(\`首 token 延迟: \${((firstTokenTime - startTime) / 1000).toFixed(2)}秒\`)
      process.stdout.write('流式输出: ')
    }
    fullText += chunk
    tokenCount++
    process.stdout.write(chunk)
  }

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log()
  console.log(\`总耗时: \${totalDuration}秒\`)
  console.log(\`总 token 数: \${tokenCount}\`)
}

// 示例3: astream_events - 事件级流式输出（v2）
async function demoAstreamEvents() {
  console.log('\\n=== astream_events 方式 ===')

  const eventStream = await chain.astream_events(
    { scene: '秋天的森林' },
    { version: 'v2' }
  )

  let eventCount = 0
  for await (const event of eventStream) {
    eventCount++
    if (event.event === 'on_chat_model_start') {
      console.log(\`[事件\${eventCount}] LLM 开始调用\`)
    } else if (event.event === 'on_chat_model_stream') {
      const token = event.data?.chunk?.content || ''
      if (token) {
        process.stdout.write(token)
      }
    } else if (event.event === 'on_chat_model_end') {
      console.log()
      console.log(\`[事件\${eventCount}] LLM 调用结束\`)
    } else if (event.event === 'on_chain_start') {
      console.log(\`[事件\${eventCount}] 链开始: \${event.name}\`)
    } else if (event.event === 'on_chain_end') {
      console.log(\`[事件\${eventCount}] 链结束: \${event.name}\`)
    }
  }
  console.log(\`总事件数: \${eventCount}\`)
}

// 示例4: batch - 批量处理
async function demoBatch() {
  console.log('\\n=== batch 方式 ===')
  const startTime = Date.now()

  const inputs = [
    { scene: '春天的花园' },
    { scene: '夏日海边' },
    { scene: '秋天的森林' },
  ]

  const results = await chain.batch(inputs, {
    maxConcurrency: 3, // 最大并发数
  })

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(\`批量处理 \${results.length} 个请求，耗时: \${duration}秒\`)
  results.forEach((res, i) => {
    console.log(\`结果\${i + 1}长度: \${res.length}字\`)
  })
}

// 示例5: stream_log - 流式获取中间步骤日志
async function demoStreamLog() {
  console.log('\\n=== stream_log 方式 ===')

  const logStream = await chain.streamLog({ scene: '冬天的雪山' })

  for await (const log of logStream) {
    if (log.ops && log.ops.length > 0) {
      log.ops.forEach((op: any) => {
        if (op.value?.content) {
          process.stdout.write(op.value.content)
        }
      })
    }
  }
  console.log()
}

// 示例6: 控制流式输出的速率（节流）
async function demoThrottledStream() {
  console.log('\\n=== 节流流式输出 ===')

  const stream = await chain.stream({ scene: '城市夜景' })
  let buffer = ''
  let lastFlush = Date.now()

  for await (const chunk of stream) {
    buffer += chunk
    const now = Date.now()
    // 每 100ms 刷新一次
    if (now - lastFlush >= 100) {
      process.stdout.write(buffer)
      buffer = ''
      lastFlush = now
    }
  }
  // 输出剩余内容
  if (buffer) {
    process.stdout.write(buffer)
  }
  console.log()
}

// 示例7: 取消流式请求
async function demoAbortStream() {
  console.log('\\n=== 取消流式请求 ===')

  const controller = new AbortController()

  // 3 秒后取消
  setTimeout(() => {
    console.log('\\n[取消请求]')
    controller.abort()
  }, 3000)

  try {
    const stream = await chain.stream(
      { scene: '写一篇很长的故事' },
      { signal: controller.signal }
    )

    for await (const chunk of stream) {
      process.stdout.write(chunk)
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('\\n请求已取消')
    } else {
      throw error
    }
  }
}`;export{n as default};
