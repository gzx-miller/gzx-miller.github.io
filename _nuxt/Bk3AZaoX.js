const n=`// ═══════════════════════════════════════════
// 1. package.json：声明依赖意图
// ═══════════════════════════════════════════

const packageJson = {
  name: 'shop-web',
  version: '1.2.3',                          // 说明：应用自身的版本号
  scripts: { build: 'vite build', test: 'vitest run' },   // 说明：脚本也属于声明
  dependencies: { express: '^4.18.0' },      // 说明：运行时真正用到的依赖
  devDependencies: { vitest: '~0.34.0' }     // 说明：仅构建与测试阶段使用
}
const runtimeDeps = Object.keys(packageJson.dependencies).length   // 结果：1
const devDeps = Object.keys(packageJson.devDependencies).length    // 结果：1

// ═══════════════════════════════════════════
// 2. SemVer：三段版本号各自约定
// ═══════════════════════════════════════════

const [major, minor, patch] = '4.1.0'.split('.').map(Number)       // 结果：[4, 1, 0]
function bump(kind) {
  if (kind === 'major') return \`\${major + 1}.0.0\`                  // 结果：5.0.0，多半不兼容
  if (kind === 'minor') return \`\${major}.\${minor + 1}.0\`           // 结果：4.2.0，向后兼容的新功能
  return \`\${major}.\${minor}.\${patch + 1}\`                          // 结果：4.1.1，向后兼容的修复
}
console.log(bump('minor'))                                          // 结果：4.2.0

// ═══════════════════════════════════════════
// 3. 版本范围：允许升到哪一档
// ═══════════════════════════════════════════

const ranges = {
  '^4.1.0': '>=4.1.0 <5.0.0',                // 说明：允许次版本与补丁更新
  '~4.1.0': '>=4.1.0 <4.2.0',                // 说明：只允许补丁更新
  '4.1.0': '=4.1.0',                         // 说明：精确锁定，范围最窄
  '*': '无边界',                             // 说明：范围过宽，无法复现
  'latest': '始终取最新'                     // 说明：等同无边界，最危险
}
for (const [range, bound] of Object.entries(ranges)) {
  console.log(range, '→', bound)             // 结果：^4.1.0 → >=4.1.0 <5.0.0
}

// ═══════════════════════════════════════════
// 4. 锁文件：记录整棵依赖树的精确版本
// ═══════════════════════════════════════════

const lockfile = {
  lockfileVersion: 9,
  packages: { express: '4.18.2', vitest: '0.34.1' }   // 结果：含间接依赖的确切版本与校验信息
}
const lockedCount = Object.keys(lockfile.packages).length           // 结果：2
const submitLockfile = true                                          // 说明：锁文件必须提交进仓库

// ═══════════════════════════════════════════
// 5. 冻结安装、脚本审查与依赖审计
// ═══════════════════════════════════════════

const ciInstall = 'pnpm install --frozen-lockfile'   // 说明：锁文件与 package.json 不一致则直接失败
const auditCmd = 'pnpm audit'                        // 说明：扫描已知漏洞并评估升级路径
const bannedRanges = ['*', 'latest']                 // 说明：范围过宽的取值一律禁止
const hasRiskyRange = Object.values(packageJson.dependencies)
  .some((range) => bannedRanges.includes(range))     // 结果：false
const postinstallNeedsReview = true                  // 说明：安装脚本有执行代码权限，需审查来源
`;export{n as default};
