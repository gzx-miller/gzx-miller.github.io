const n=`// ═══════════════════════════════════════════
// 1. 用 node:assert/strict 写断言
// ═══════════════════════════════════════════

import test, { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'

function add(a, b) {
  return a + b
}

test('adds values', () => {
  assert.equal(add(2, 3), 5)                                  // 不符预期直接抛错，退出码非零
})

// ═══════════════════════════════════════════
// 2. 按行为组织用例与子测试
// ═══════════════════════════════════════════

describe('数学运算', () => {
  it('两个正数相加', () => {
    assert.equal(add(2, 3), 5)                                // 一个用例只验一件事
  })
  it('正负相加', () => {
    assert.equal(add(-1, 1), 0)
  })
  it('边界为零', () => {
    assert.equal(add(0, 0), 0)                                // 结果：失败时能定位到具体行为
  })
})

// ═══════════════════════════════════════════
// 3. 异步测试必须 await
// ═══════════════════════════════════════════

const fetchUser = (id) => Promise.resolve({ id, name: \`用户\${id}\` })

test('异步获取用户', async () => {
  const user = await fetchUser(1)                             // 忘记 await 会得到假阳性
  assert.deepEqual(user, { id: 1, name: '用户1' })
})

// ═══════════════════════════════════════════
// 4. mock 与调用后清理
// ═══════════════════════════════════════════

test('记录调用次数', () => {
  const fn = mock.fn((x) => x * 2)                            // 创建 mock 函数
  assert.equal(fn(5), 10)
  assert.equal(fn.mock.calls.length, 1)                       // 结果：调用被记录下来
  fn.mock.resetCalls()                                        // 用完清理，避免污染后续用例
})

// ═══════════════════════════════════════════
// 5. 运行入口、覆盖率与报告
// ═══════════════════════════════════════════

const reporters = ['spec', 'tap', 'junit']                    // TAP / JUnit 供 CI 消费

// node --test                                运行 test 目录下所有用例
// node --test --experimental-test-coverage   查看未被覆盖的分支
// 说明：失败时进程以非零退出码结束，CI 据此拦下回归
`;export{n as default};
