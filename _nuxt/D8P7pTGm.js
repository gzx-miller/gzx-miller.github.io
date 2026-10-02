const n=`import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { Document } from '@langchain/core/documents'

// 示例1: 基础文本切分
const longText = \`
LangChain 是一个用于开发由语言模型驱动的应用程序的框架。
它使应用程序能够：
1. 将语言模型与外部数据源连接起来
2. 允许语言模型与其环境进行交互

LangChain 的核心价值主张是：
- 组件：用于处理语言模型的抽象概念，以及每个抽象概念的实现集合。组件是模块化且易于使用的，无论您是否使用 LangChain 框架的其余部分。
- 即用型链：用于完成特定更高级别任务的组件的结构化组合。即用型链让您可以轻松上手。对于更复杂的应用程序和细致入微的用例，组件可以轻松自定义链。

主要模块包括：
- Models: 各种类型的模型和模型集成
- Prompts: 提示词管理、提示词优化等
- Memory: 短期记忆、长期记忆等
- Chains: 各种链式调用
- Agents: 代理、工具等
- Retrieval: 检索增强生成
- Callbacks: 回调系统
\`

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 40,
  separators: ['\\n\\n', '\\n', '。', '，', ' '],
})

const docs = await splitter.createDocuments([longText])
console.log(\`切分为 \${docs.length} 个块\`)
docs.forEach((doc, i) => {
  console.log(\`块\${i + 1} (\${doc.pageContent.length}字符): \${doc.pageContent.slice(0, 50)}...\`)
})

// 示例2: 配置不同的 chunkSize 和 chunkOverlap
const splitterSmall = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
})

const splitterLarge = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
})

// 示例3: 带元数据的文档切分
const docsWithMetadata = [
  new Document({
    pageContent: '这是文档的第一部分内容...',
    metadata: { source: 'chapter1', page: 1 },
  }),
  new Document({
    pageContent: '这是文档的第二部分内容...',
    metadata: { source: 'chapter1', page: 2 },
  }),
]

const splitDocs = await splitter.splitDocuments(docsWithMetadata)
console.log('切分后元数据保留:', splitDocs[0].metadata)

// 示例4: 从文件加载并切分 (TextLoader)
// const loader = new TextLoader('path/to/document.txt')
// const rawDocs = await loader.load()
// const splitDocs = await splitter.splitDocuments(rawDocs)

// 示例5: 按字符切分 CharacterTextSplitter
import { CharacterTextSplitter } from 'langchain/text_splitter'

const charSplitter = new CharacterTextSplitter({
  separator: '\\n',
  chunkSize: 200,
  chunkOverlap: 20,
})

// 示例6: 切分代码 - 使用语言特定的切分器
import { SupportedTextSplitterLanguages } from 'langchain/text_splitter'

// 查看支持的语言
console.log('支持的语言:', SupportedTextSplitterLanguages)

// 示例: JavaScript 代码切分
const jsCode = \`
function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}

class DataProcessor {
  constructor(data) {
    this.data = data;
  }

  process() {
    return this.data.map(item => item * 2);
  }
}

const numbers = [1, 2, 3, 4, 5];
console.log(calculateSum(numbers));
\`

const jsSplitter = RecursiveCharacterTextSplitter.fromLanguage('js', {
  chunkSize: 150,
  chunkOverlap: 30,
})

const jsChunks = await jsSplitter.createDocuments([jsCode])
console.log(\`JS代码切分为 \${jsChunks.length} 块\`)
`;export{n as default};
