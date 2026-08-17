import fs from 'fs';
import path from 'path';

const INPUT_FILE = 'src/data/lessons.ts';
const OUTPUT_DIR = 'src/data/lessons';

// 前缀到分类的映射
const PREFIX_TO_CATEGORY = {
  'K': 'vue',
  'E': 'element-plus',
  'R': 'react',
  'L': 'langchain',
  'N': 'nuxt',
  'X': 'nextjs',
  'J': 'javascript',
  'T': 'typescript',
  'C': 'css',
  'TW': 'tailwind-css',
  'SC': 'sass',
  'V': 'vite',
  'CPP': 'cpp',
  'D': 'engineering',
  'G': 'nodejs',
};

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const content = fs.readFileSync(INPUT_FILE, 'utf-8');

// 提取文件头部（imports 和工具函数）
const headerEndMarker = 'const K01AppEntry = createDemo';
const headerEndIdx = content.indexOf(headerEndMarker);
const header = content.substring(0, headerEndIdx);

// 提取 knowledgeCategories
const categoriesStart = content.indexOf('export const knowledgeCategories');
const categoriesEnd = content.indexOf(']', categoriesStart) + 1;
const knowledgeCategoriesStr = content.substring(categoriesStart, categoriesEnd + 1);

// 提取 lessons 数组
const lessonsStart = content.indexOf('export const lessons: Lesson[] = [');
const lessonsEnd = content.lastIndexOf(']') + 1;
const lessonsArrayStr = content.substring(lessonsStart, lessonsEnd + 1);

// 解析每个 lesson 对象
function parseLessons(lessonsStr) {
  const lessons = [];
  let currentIdx = lessonsStr.indexOf('{', lessonsStr.indexOf('[')) + 1;
  
  while (currentIdx > 0 && currentIdx < lessonsStr.length) {
    // 找到匹配的结束大括号
    let braceCount = 1;
    let endIdx = currentIdx;
    
    while (braceCount > 0 && endIdx < lessonsStr.length) {
      const char = lessonsStr[endIdx];
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      endIdx++;
    }
    
    const lessonStr = lessonsStr.substring(currentIdx - 1, endIdx);
    
    // 提取 id 和 path
    const idMatch = lessonStr.match(/id:\s*'([^']+)'/);
    const pathMatch = lessonStr.match(/path:\s*'([^']+)'/);
    
    if (idMatch && pathMatch) {
      const id = idMatch[1];
      const path = pathMatch[1];
      const category = path.split('/').filter(Boolean)[0];
      
      lessons.push({
        id,
        path,
        category,
        fullText: lessonStr,
      });
    }
    
    // 移动到下一个 lesson
    currentIdx = lessonsStr.indexOf('{', endIdx) + 1;
    if (currentIdx === 0) break;
  }
  
  return lessons;
}

console.log('Parsing lessons array...');
const lessons = parseLessons(lessonsArrayStr);
console.log(`Found ${lessons.length} lessons`);

// 按分类分组
const lessonsByCategory = {};
for (const lesson of lessons) {
  if (!lessonsByCategory[lesson.category]) {
    lessonsByCategory[lesson.category] = [];
  }
  lessonsByCategory[lesson.category].push(lesson);
}

// 输出统计
console.log('\nLessons by category:');
for (const [category, catLessons] of Object.entries(lessonsByCategory)) {
  console.log(`${category}: ${catLessons.length} lessons`);
}

// 提取每个分类使用的 demo 组件
const demoUsageRegex = /(demo|code):\s*(\w+)/g;
const demosByCategory = {};

for (const [category, catLessons] of Object.entries(lessonsByCategory)) {
  const demos = new Set();
  
  for (const lesson of catLessons) {
    let match;
    while ((match = demoUsageRegex.exec(lesson.fullText)) !== null) {
      demos.add(match[2]);
    }
  }
  
  demosByCategory[category] = Array.from(demos);
}

// 输出每个分类使用的 demo
console.log('\nDemos used by category:');
for (const [category, demos] of Object.entries(demosByCategory)) {
  console.log(`${category}: ${demos.length} demos`);
}

console.log('\nSplit preparation complete.');
console.log('Next step: Extract demo definitions and create category files.');
