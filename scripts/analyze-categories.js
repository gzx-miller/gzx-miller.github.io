import fs from 'fs';
const content = fs.readFileSync('src/data/lessons.ts', 'utf-8');

// 提取所有课程路径的分类
const pathRegex = /path:\s*'([^']+)'/g;
const categories = new Set();
let match;

while ((match = pathRegex.exec(content)) !== null) {
  const path = match[1];
  const category = path.split('/').filter(Boolean)[0];
  if (category) categories.add(category);
}

console.log('Found categories:');
console.log(Array.from(categories).sort().join('\n'));
console.log(`\nTotal: ${categories.size} categories`);
