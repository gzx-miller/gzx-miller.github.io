const e=`// keyof：从对象类型提取所有键名组成联合类型
interface Preferences {
  theme: string
  density: string
  language: string
}

// PreferenceKey = 'theme' | 'density' | 'language'
type PreferenceKey = keyof Preferences

// 索引访问类型：preferences[key] 返回对应值类型
function readSetting(prefs: Preferences, key: PreferenceKey) {
  return prefs[key]  // 类型为 string
}

const prefs: Preferences = { theme: '秋日', density: '舒适', language: '中文' }
const keys: PreferenceKey[] = ['theme', 'density', 'language']

console.log(readSetting(prefs, 'theme'))  // 秋日

// 非法键名在编译期报错
// readSetting(prefs, 'fontSize')  → 类型错误
`;export{e as default};
