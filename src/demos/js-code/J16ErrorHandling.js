// ═══════════════════════════════════════════
// 1. 内置错误类型族
// ═══════════════════════════════════════════

try { null.foo } catch (e) { e.name }          // 'TypeError'
try { notDefined } catch (e) { e.name }        // 'ReferenceError'
try { new Array(-1) } catch (e) { e.name }     // 'RangeError'
try { JSON.parse('{') } catch (e) { e.name }   // 'SyntaxError'
new Error('出错').message                      // '出错'

// ═══════════════════════════════════════════
// 2. throw 可以抛任意值，但应抛 Error
// ═══════════════════════════════════════════

try { throw '字符串' } catch (e) { typeof e }    // 'string'  ← 能抛，但丢了 message 与 stack
try { throw { code: 42 } } catch (e) { e.code }  // 42       ← 对象也能抛，但不是 Error
new Error('推荐').name                           // 'Error'  ← 应抛 Error 或其子类

// ═══════════════════════════════════════════
// 3. try/catch/finally 的执行顺序
// ═══════════════════════════════════════════

const order = []
try { order.push('try'); throw new Error('x') }
catch (e) { order.push('catch') }
finally { order.push('finally') }
order.join(' → ')                              // 'try → catch → finally'

// ═══════════════════════════════════════════
// 4. catch 绑定可省略（ES2019）
// ═══════════════════════════════════════════

try { JSON.parse('{') } catch { '接住并忽略，不绑定错误对象' }   // 合法

// ═══════════════════════════════════════════
// 5. finally 里的 return 会覆盖 try/catch 的返回
// ═══════════════════════════════════════════

function a() { try { return 'ok' } finally { return 'finally' } }
a()                                            // 'finally'  ← try 的返回值被丢弃
function b() { try { throw new Error() } catch { return 'caught' } finally { return 'finally' } }
b()                                            // 'finally'  ← catch 的返回值也被覆盖

// ═══════════════════════════════════════════
// 6. 继承 Error 定义带业务字段的异常
// ═══════════════════════════════════════════

class ValidationError extends Error {
  constructor(field, message) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}
const err = new ValidationError('name', '姓名至少 2 个字符')
err.name                                       // 'ValidationError'
err.field                                      // 'name'
err instanceof ValidationError                 // true
err instanceof Error                           // true   ← 仍是一般的 Error，兜底也能接

// ═══════════════════════════════════════════
// 7. 用 cause 保留原始错误，形成错误链
// ═══════════════════════════════════════════

try {
  try { JSON.parse('bad') }
  catch (low) { throw new Error('解析配置失败', { cause: low }) }
} catch (top) {
  top.message                                  // '解析配置失败'
  top.cause.name                               // 'SyntaxError'  ← 根因仍在链上
}

// ═══════════════════════════════════════════
// 8. try/catch 接不住的异步边界
// ═══════════════════════════════════════════

try { setTimeout(() => { throw new Error('定时器内') }, 0) }
catch (e) { console.log('不会执行') }          // 回调在栈清空后运行，catch 早已退出
window.addEventListener('error', (e) => {})               // 全局兜底未捕获的同步错误
window.addEventListener('unhandledrejection', (e) => {})  // 兜底没人处理的 Promise 拒绝
