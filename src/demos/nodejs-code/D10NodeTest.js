// ═══════════════════════════════════════════
// D10 - node:test 测试运行器
// ═══════════════════════════════════════════

// Node.js 18+ 内置测试模块，无需安装第三方依赖
import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'

// 运行方式：
// node --test test/
// 或直接运行包含 test 的文件：node test/math.test.js

// ───────── 被测函数 ─────────

function add(a, b) {
  return a + b
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('除数不能为零')
  }
  return a / b
}

function asyncFetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) {
        reject(new Error('无效的用户 ID'))
      } else {
        resolve({ id, name: `用户${id}` })
      }
    }, 100)
  })
}

// ───────── 基本测试 ─────────

test('加法测试', () => {
  assert.equal(add(1, 2), 3)
  assert.equal(add(-1, 1), 0)
  assert.equal(add(0, 0), 0)
})

test('除法测试', () => {
  assert.equal(divide(10, 2), 5)
  assert.throws(() => divide(1, 0), /除数不能为零/)
})

// ───────── 异步测试 ─────────

test('异步获取用户 - async/await', async () => {
  const user = await asyncFetchUser(1)
  assert.deepEqual(user, { id: 1, name: '用户1' })
})

test('异步获取用户 - Promise 拒绝', async () => {
  await assert.rejects(
    asyncFetchUser(0),
    /无效的用户 ID/
  )
})

// ───────── describe / it 分组（BDD 风格） ─────────

describe('数学运算', () => {
  describe('加法', () => {
    it('两个正数相加', () => {
      assert.equal(add(2, 3), 5)
    })

    it('正负相加', () => {
      assert.equal(add(-1, 1), 0)
    })
  })

  describe('除法', () => {
    it('正常除法', () => {
      assert.equal(divide(20, 4), 5)
    })

    it('除以零抛出错误', () => {
      assert.throws(() => divide(1, 0))
    })
  })
})

// ───────── 测试钩子 ─────────

describe('带钩子的测试', () => {
  let database = null
  let counter = 0

  // 在所有测试前运行一次
  test.before(() => {
    database = { connected: true, data: [] }
    console.log('数据库已连接')
  })

  // 在所有测试后运行一次
  test.after(() => {
    database.connected = false
    console.log('数据库已断开')
  })

  // 每个测试前运行
  test.beforeEach(() => {
    counter++
    database.data = []
    console.log(`第 ${counter} 个测试开始`)
  })

  // 每个测试后运行
  test.afterEach(() => {
    console.log(`第 ${counter} 个测试结束`)
  })

  test('添加数据', () => {
    database.data.push('item1')
    assert.equal(database.data.length, 1)
  })

  test('清空数据', () => {
    assert.equal(database.data.length, 0) // beforeEach 已清空
  })
})

// ───────── 跳过和仅运行 ─────────

// test.skip('这个测试会被跳过', () => {
//   assert.equal(1, 2) // 不会执行
// })

// test.only('只运行这个测试', () => {
//   assert.equal(1, 1)
// })

// ───────── assert 断言方法 ─────────

test('assert 常用断言', () => {
  // 相等性
  assert.equal(1 + 1, 2)                 // === 严格相等
  assert.notEqual(1, 2)
  assert.deepEqual([1, 2, 3], [1, 2, 3]) // 深度相等
  assert.notDeepEqual({ a: 1 }, { a: 2 })

  // 布尔断言
  assert.ok(1 > 0)                       // 真值断言
  assert.ok('hello', '字符串应该是 truthy')

  // 异常断言
  assert.throws(() => JSON.parse('{invalid}'))
  assert.throws(() => {
    throw new Error('oops')
  }, { name: 'Error', message: 'oops' })

  // Promise 断言
  // await assert.rejects(Promise.reject(new Error('fail')))
  // await assert.doesNotReject(Promise.resolve(1))

  // 类型检查
  assert.equal(typeof 'hello', 'string')
  assert.ok(Array.isArray([]))
})

// ───────── Mock / 模拟 ─────────

// Node.js 20+ 支持内置 mock
import { mock } from 'node:test'

test('mock 函数示例', () => {
  // 创建 mock 函数
  const fn = mock.fn((x) => x * 2)

  const result = fn(5)

  assert.equal(result, 10)
  assert.equal(fn.mock.calls.length, 1)
  assert.deepEqual(fn.mock.calls[0].arguments, [5])

  // 重置 mock
  fn.mock.resetCalls()
  assert.equal(fn.mock.calls.length, 0)
})

// ───────── 测试覆盖率 ─────────

// 运行测试并生成覆盖率报告（Node 21+）
// node --experimental-test-coverage --test test/

// ───────── 常用测试模式 ─────────

// 1. 参数化测试
function parameterizedTest(name, cases, fn) {
  for (const [input, expected] of cases) {
    test(`${name}: ${JSON.stringify(input)}`, () => {
      fn(input, expected)
    })
  }
}

parameterizedTest('加法参数化', [
  [[1, 2], 3],
  [[0, 0], 0],
  [[-1, 1], 0],
  [[100, 200], 300]
], ([a, b], expected) => {
  assert.equal(add(a, b), expected)
})

// 2. 快照测试（需要额外库如 node:test 配合快照工具）

// ───────── 命令行参数 ─────────
// node --test test/                    运行 test 目录下所有测试
// node --test --watch test/            监听模式（文件变化自动重跑）
// node --test --test-name-pattern="加法"  只运行匹配的测试
// node --experimental-test-coverage    覆盖率（Node 21+）
// node --test-reporter=spec            输出格式: spec, dot, tap, junit

// ───────── 最佳实践 ─────────
// 测试文件命名：*.test.js 或 *.spec.js
// 一个测试只测一个功能点
// 测试描述要清晰，说明测什么、期望什么
// 使用 AAA 模式：Arrange（准备）- Act（执行）- Assert（断言）
// 测试要独立，不依赖其他测试的执行顺序
// 异步测试用 async/await，不要用 done 回调
// 用 beforeEach/afterEach 做测试隔离
// 生产代码和测试代码分开存放
