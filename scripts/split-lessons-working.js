import fs from 'fs';
import path from 'path';

const INPUT_FILE = 'src/data/lessons.ts';
const OUTPUT_DIR = 'src/data/lessons';

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const content = fs.readFileSync(INPUT_FILE, 'utf-8');

// 解析 lessons 数组的内容
// 找到 lessons 数组的开始和结束
const lessonsArrayStart = content.indexOf('export const lessons: Lesson[] = [') + 'export const lessons: Lesson[] = ['.length;
let lessonsArrayEnd = content.indexOf('\n]', lessonsArrayStart);

// 如果找不到，尝试其他方法
if (lessonsArrayEnd === -1) {
  // 找到最后一个 } 后面跟着 ], 的位置
  for (let i = content.length - 1; i >= 0; i--) {
    if (content.substring(i, i + 3) === ']\n') {
      lessonsArrayEnd = i;
      break;
    }
  }
}

console.log('Lessons array: start =', lessonsArrayStart, ', end =', lessonsArrayEnd);

const lessonsContent = content.substring(lessonsArrayStart, lessonsArrayEnd);

// 解析 lesson 对象 - 使用字符级解析
function parseLessonObjects(text) {
  const lessons = [];
  let pos = 0;
  let currentObjStart = -1;
  let braceDepth = 0;
  let inString = false;
  let stringChar = '';
  let inComment = false;
  let commentType = ''; // 'single' or 'multi'
  
  while (pos < text.length) {
    const char = text[pos];
    const nextChar = pos + 1 < text.length ? text[pos + 1] : '';
    
    // 处理注释
    if (!inString && !inComment && char === '/' && nextChar === '/') {
      inComment = true;
      commentType = 'single';
      pos += 2;
      continue;
    }
    if (inComment && commentType === 'single' && char === '\n') {
      inComment = false;
      pos++;
      continue;
    }
    if (!inString && !inComment && char === '/' && nextChar === '*') {
      inComment = true;
      commentType = 'multi';
      pos += 2;
      continue;
    }
    if (inComment && commentType === 'multi' && char === '*' && nextChar === '/') {
      inComment = false;
      pos += 2;
      continue;
    }
    if (inComment) {
      pos++;
      continue;
    }
    
    // 处理字符串
    if (!inString && (char === '"' || char === "'" || char === '`')) {
      inString = true;
      stringChar = char;
      pos++;
      continue;
    }
    if (inString && char === '\\') {
      pos += 2; // 跳过转义字符
      continue;
    }
    if (inString && char === stringChar) {
      inString = false;
      pos++;
      continue;
    }
    if (inString) {
      pos++;
      continue;
    }
    
    // 处理大括号
    if (char === '{') {
      if (braceDepth === 0) {
        currentObjStart = pos;
      }
      braceDepth++;
    }
    if (char === '}') {
      braceDepth--;
      if (braceDepth === 0 && currentObjStart !== -1) {
        // 找到一个完整的 lesson 对象
        const objText = text.substring(currentObjStart, pos + 1);
        
        // 提取 id 和 path
        const idMatch = objText.match(/id:\s*'([^']+)'/);
        const pathMatch = objText.match(/path:\s*'([^']+)'/);
        
        if (idMatch && pathMatch) {
          lessons.push({
            id: idMatch[1],
            path: pathMatch[1],
            category: pathMatch[1].split('/').filter(Boolean)[0],
            text: objText,
          });
        }
        
        currentObjStart = -1;
      }
    }
    
    pos++;
  }
  
  return lessons;
}

console.log('Parsing lesson objects...');
const allLessons = parseLessonObjects(lessonsContent);
console.log(`Found ${allLessons.length} lessons`);

if (allLessons.length === 0) {
  console.log('ERROR: No lessons found. Check the parsing logic.');
  process.exit(1);
}

// 按分类分组
const lessonsByCategory = {};
for (const lesson of allLessons) {
  if (!lessonsByCategory[lesson.category]) {
    lessonsByCategory[lesson.category] = [];
  }
  lessonsByCategory[lesson.category].push(lesson);
}

console.log('\nLessons by category:');
for (const [category, catLessons] of Object.entries(lessonsByCategory)) {
  console.log(`${category}: ${catLessons.length} lessons`);
}

// 提取每个分类需要的 demo 定义
const demoDefs = [];
const demoDefRegex = /(const \w+ = (createDemo|createCodeLoader)\([^)]+\))/g;
let demoMatch;

while ((demoMatch = demoDefRegex.exec(content)) !== null) {
  demoDefs.push({
    name: demoMatch[1].match(/const (\w+)/)[1],
    definition: demoMatch[1],
    fullMatch: demoMatch[0],
  });
}

console.log(`\nFound ${demoDefs.length} demo definitions in main file`);

// 为每个分类创建文件
for (const [category, lessons] of Object.entries(lessonsByCategory)) {
  const fileName = `${category}.ts`;
  const filePath = path.join(OUTPUT_DIR, fileName);
  
  // 找到这个分类需要的所有 demo
  const neededDemos = new Set();
  const demoUsageRegex = /(demo|code):\s*(\w+)/g;
  
  for (const lesson of lessons) {
    let match;
    const text = lesson.text;
    while ((match = demoUsageRegex.exec(text)) !== null) {
      neededDemos.add(match[2]);
    }
  }
  
  // 提取需要的 demo 定义
  const categoryDemoDefs = [];
  for (const demoName of neededDemos) {
    const def = demoDefs.find(d => d.name === demoName);
    if (def) {
      categoryDemoDefs.push(def.definition);
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
  if (!loader) throw new Error(\`未找到案例组件：\${name}\`)
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
  if (!loader) throw new Error(\`未找到案例源码：\${path}\`)
  return loader
}

${categoryDemoDefs.join('\n')}

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
  console.log(`Created ${fileName} with ${lessons.length} lessons and ${categoryDemoDefs.length} demo definitions`);
}

console.log('\nAll category files created successfully!');
console.log('\nNext steps:');
console.log('1. Modify src/data/lessons.ts to dynamically import from category files');
console.log('2. Update consumers to use dynamic imports');
