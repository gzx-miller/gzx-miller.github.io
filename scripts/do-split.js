import fs from 'fs';
import path from 'path';

const INPUT_FILE = 'src/data/lessons.ts';
const OUTPUT_DIR = 'src/data/lessons';

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const content = fs.readFileSync(INPUT_FILE, 'utf-8');

// 提取文件头部
const headerEndMarker = 'const K01AppEntry = createDemo';
const headerEndIdx = content.indexOf(headerEndMarker);
const header = content.substring(0, headerEndIdx);

// 提取 knowledgeCategories
const categoriesStart = content.indexOf('export const knowledgeCategories');
const categoriesEnd = content.indexOf(']', categoriesStart) + 1;
const knowledgeCategoriesStr = content.substring(categoriesStart, categoriesEnd + 1);

// 提取 lessons 数组
const lessonsStartMarker = 'export const lessons: Lesson[] = [';
const lessonsStart = content.indexOf(lessonsStartMarker);
const lessonsArrayStart = content.indexOf('[', lessonsStart) + 1;
const lessonsEnd = content.lastIndexOf('\n]\n', content.length) + 2;
const lessonsContent = content.substring(lessonsArrayStart, lessonsEnd - 1);

// 解析各个 lesson 对象
function extractLessons(content) {
  const lessons = [];
  let pos = 0;
  
  while (pos < content.length) {
    // 找到下一个 lesson 对象的开始
    const objStart = content.indexOf('{', pos);
    if (objStart === -1) break;
    
    // 找到匹配的结束大括号
    let braceCount = 1;
    let objEnd = objStart + 1;
    
    while (braceCount > 0 && objEnd < content.length) {
      const char = content[objEnd];
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      objEnd++;
    }
    
    const lessonStr = content.substring(objStart, objEnd);
    
    // 提取关键信息
    const idMatch = lessonStr.match(/id:\s*'([^']+)'/);
    const pathMatch = lessonStr.match(/path:\s*'([^']+)'/);
    
    if (idMatch && pathMatch) {
      const id = idMatch[1];
      const lessonPath = pathMatch[1];
      const category = lessonPath.split('/').filter(Boolean)[0];
      
      lessons.push({
        id,
        path: lessonPath,
        category,
        text: lessonStr,
      });
    }
    
    pos = objEnd;
  }
  
  return lessons;
}

console.log('Extracting lessons...');
const allLessons = extractLessons(lessonsContent);
console.log(`Found ${allLessons.length} lessons`);

// 按分类分组
const lessonsByCategory = {};
for (const lesson of allLessons) {
  if (!lessonsByCategory[lesson.category]) {
    lessonsByCategory[lesson.category] = [];
  }
  lessonsByCategory[lesson.category].push(lesson);
}

// 创建每个分类的文件
for (const [category, lessons] of Object.entries(lessonsByCategory)) {
  const fileName = `${category}.ts`;
  const filePath = path.join(OUTPUT_DIR, fileName);
  
  // 提取这个分类使用的所有 demo
  const demoSet = new Set();
  const demoRegex = /(demo|code):\s*(\w+)/g;
  
  for (const lesson of lessons) {
    let match;
    const text = lesson.text;
    while ((match = demoRegex.exec(text)) !== null) {
      demoSet.add(match[2]);
    }
  }
  
  // 查找 demo 定义
  const demoDefs = [];
  for (const demoName of demoSet) {
    const defRegex = new RegExp(`(const ${demoName} = (createDemo|createCodeLoader)\\([^)]+\\))`, 'g');
    const defMatch = content.match(defRegex);
    if (defMatch) {
      for (const def of defMatch) {
        if (!demoDefs.includes(def)) {
          demoDefs.push(def);
        }
      }
    }
  }
  
  // 生成文件内容
  const fileContent = `import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'

const demoModules = import.meta.glob<Component>('../../demos/*.vue', { import: 'default' })
const vueCodeModules = import.meta.glob<string>('../../demos/*.vue', { query: '?raw', import: 'default' })
const jsxCodeModules = import.meta.glob<string>('../../demos/react-jsx/*.jsx', { query: '?raw', import: 'default' })
const stateCodeModules = import.meta.glob<string>('../../demos/state-react/*.js', { query: '?raw', import: 'default' })
const jsCodeModules = import.meta.glob<string>('../../demos/js-code/*.js', { query: '?raw', import: 'default' })
const tsCodeModules = import.meta.glob<string>('../../demos/ts-code/*.ts', { query: '?raw', import: 'default' })
const styleCodeModules = import.meta.glob<string>('../../demos/style-code/*', { query: '?raw', import: 'default' })

function createDemo(name: string) {
  const loader = demoModules[\`../../demos/\${name}.vue\`]
  if (!loader) throw new Error(\`未找到内容组件：\${name}\`)
  return defineAsyncComponent(async () => {
    if (name.startsWith('E')) await import('../../element-plus/styles')
    return loader()
  })
}

function createCodeLoader(path: string) {
  const modules = path.startsWith('react-jsx/')
    ? jsxCodeModules
    : path.startsWith('state-react/')
      ? stateCodeModules
      : path.startsWith('js-code/')
        ? jsCodeModules
        : path.startsWith('ts-code/')
          ? tsCodeModules
          : path.startsWith('style-code/')
            ? styleCodeModules
            : vueCodeModules
  const loader = modules[\`../../demos/\${path}\`]
  if (!loader) throw new Error(\`未找到内容源码：\${path}\`)
  return loader
}

${demoDefs.join('\n')}

export interface Lesson {
  id: string
  title: string
  navTitle: string
  category: string
  path: string
  summary: string
  demo?: Component
  code?: string
  language?: string
  principle?: string
  flow?: string[]
  notes?: string[]
  problem?: string
  officialUrl?: string
}

export const lessons: Lesson[] = [
${lessons.map(l => l.text).join(',\n')}
]
`;
  
  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`Created ${fileName} with ${lessons.length} lessons and ${demoDefs.length} demo definitions`);
}

console.log('\nAll category files created successfully!');
