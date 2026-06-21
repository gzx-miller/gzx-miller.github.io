// ========== 模板字面量基础 ==========
const name = 'Vue3 实战'
const price = 299

// 插值表达式：可嵌入任意 JS 表达式
const info = `课程《${name}》现价 ¥${price}，省 ${500 - price} 元`

// 多行字符串：无需手动拼接
const html = `
  <div class="card">
    <h3>${name}</h3>
    <p>价格：¥${price}</p>
  </div>
`

// ========== 标签模板 ==========
// 函数签名：(strings, ...values)
// strings：静态部分数组（长度 = values.length + 1）
// values：插值部分数组
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const val = values[i] !== undefined ? `<mark>${values[i]}</mark>` : ''
    return result + str + val
  }, '')
}

const course = 'TypeScript'
const score = 95
console.log(highlight`学员在 ${course} 考试中取得了 ${score} 分！`)
// 学员在 <mark>TypeScript</mark> 考试中取得了 <mark>95</mark> 分！

// ========== HTML 转义标签模板 ==========
function safeHtml(strings, ...values) {
  const escape = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  return strings.reduce((result, str, i) =>
    result + str + (values[i] !== undefined ? escape(values[i]) : ''), '')
}

const userInput = '<script>alert("xss")</script>'
console.log(safeHtml`<p>用户输入：${userInput}</p>`)
// <p>用户输入：&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</p>

// ========== String.raw ==========
// 获取原始字符串，转义字符不被处理
console.log(String.raw`\n \t \\`)  // 字面量 \n \t \\（不是换行和制表符）

// ========== css 标签模板概念 ==========
// styled-components 的核心原理就是标签模板
// const Button = styled.button`color: ${props => props.color};`
