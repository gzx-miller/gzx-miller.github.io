import fs from 'fs';
import path from 'path';

const INPUT_FILE = 'src/data/lessons.ts';
const OUTPUT_DIR = 'src/data/lessons';

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const content = fs.readFileSync(INPUT_FILE, 'utf-8');

// 提取文件头部（imports 和工具函数）
const headerMatch = content.match(/^([\s\S]*?)(?=const K01AppEntry)/);
const header = headerMatch ? headerMatch[1] : '';

// 提取 knowledgeCategories
const categoriesMatch = content.match(/export const knowledgeCategories: KnowledgeCategory\[\] = \[([\s\S]*?)\];/);
const knowledgeCategories = categoriesMatch ? categoriesMatch[1] : '';

// 提取所有课程的路径和分类
const lessons = [];
const lessonRegex = /\{\s*id:\s*'([^']+)'[\s\S]*?path:\s*'([^']+)'/g;
let match;

while ((match = lessonRegex.exec(content)) !== null) {
  const [fullMatch, id, path] = match;
  const category = path.split('/').filter(Boolean)[0];
  const startIdx = match.index;
  lessons.push({ id, path, category, startIdx });
}

// 找到每个 lesson 对象的结束位置
for (let i = 0; i < lessons.length; i++) {
  const currentStart = lessons[i].startIdx;
  const nextStart = i < lessons.length - 1 ? lessons[i + 1].startIdx : content.indexOf('\n]\n', currentStart);
  
  // 找到当前 lesson 对象的结束大括号
  let braceCount = 0;
  let endIdx = currentStart;
  let foundStart = false;
  
  for (let j = currentStart; j < (nextStart > 0 ? nextStart : content.length); j++) {
    if (content[j] === '{') {
      braceCount++;
      foundStart = true;
    } else if (content[j] === '}') {
      braceCount--;
      if (foundStart && braceCount === 0) {
        endIdx = j + 1;
        break;
      }
    }
  }
  
  lessons[i].endIdx = endIdx;
}

// 按分类分组
const lessonsByCategory = {};
for (const lesson of lessons) {
  if (!lessonsByCategory[lesson.category]) {
    lessonsByCategory[lesson.category] = [];
  }
  lessonsByCategory[lesson.category].push(lesson);
}

// 输出统计信息
console.log('Lessons by category:');
for (const [category, catLessons] of Object.entries(lessonsByCategory)) {
  console.log(`${category}: ${catLessons.length} lessons`);
}

// 提取每个分类的 demo 组件名称模式
const demoPatterns = {
  'vue': /^K\d+/,
  'element-plus': /^E\d+/,
  'react': /^R\d+/,
  'langchain': /^L\d+/,
  'cpp': /^CPP\d+/,
  'javascript': /^JS\d+/,
  'typescript': /^TS\d+/,
  'css': /^CSS\d+/,
  'tailwind-css': /^TW\d+/,
  'sass': /^SASS\d+/,
  'vite': /^VITE\d+/,
  'nuxt': /^NUXT\d+/,
  'nodejs': /^NODE\d+/,
  'engineering': /^ENG\d+/,
  'nextjs': /^NEXT\d+/,
};

// 查找所有 demo 组件定义
const demoDefRegex = /(const \w+ = createDemo\([^)]+\)|const \w+ = createCodeLoader\([^)]+\))/g;
const demoDefs = [];
let demoMatch;

while ((demoMatch = demoDefRegex.exec(content)) !== null) {
  demoDefs.push({
    text: demoMatch[0],
    name: demoMatch[0].match(/const (\w+)/)[1],
    startIdx: demoMatch.index,
  });
}

console.log(`\nFound ${demoDefs.length} demo definitions`);

// 按分类分组 demo 定义
const demosByCategory = {};
for (const demo of demoDefs) {
  let assigned = false;
  for (const [category, pattern] of Object.entries(demoPatterns)) {
    if (pattern.test(demo.name)) {
      if (!demosByCategory[category]) {
        demosByCategory[category] = [];
      }
      demosByCategory[category].push(demo);
      assigned = true;
      break;
    }
  }
  
  if (!assigned) {
    console.log(`Warning: Could not assign demo ${demo.name} to any category`);
  }
}

// 输出每个分类的 demo 数量
console.log('\nDemos by category:');
for (const [category, demos] of Object.entries(demosByCategory)) {
  console.log(`${category}: ${demos.length} demo definitions`);
}

console.log('\nAnalysis complete. Ready to split files.');
