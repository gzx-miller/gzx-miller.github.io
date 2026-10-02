// nitro 在打包服务端产物时，会把源码中的 `import.meta` 文本替换成 `globalThis._importMeta_`，
// 使以 ?raw 内联的代码样本在预渲染 HTML 与 payload 中被污染。展示前统一做一次逆向还原。
// 注意：还原后的干净字面量用数组拼接构造，避免被同一条替换规则二次污染。
const POLLUTED_META = 'globalThis._importMeta_'
const CLEAN_META = ['import', 'meta'].join('.')

export function restoreCodeSource(source: string): string {
  return source.includes(POLLUTED_META)
    ? source.split(POLLUTED_META).join(CLEAN_META)
    : source
}
