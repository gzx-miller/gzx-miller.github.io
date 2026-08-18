import { describe, expect, it } from 'vitest'
import { assignLayers, layoutByLayers } from './useFlowAutoLayout'

const nodes = [
  { id: 'start' },
  { id: 'review' },
  { id: 'audit' },
  { id: 'end' },
]

const edges = [
  { source: 'start', target: 'review' },
  { source: 'review', target: 'audit' },
  { source: 'start', target: 'audit' },
  { source: 'audit', target: 'end' },
]

describe('assignLayers', () => {
  it('按依赖关系分层，共享前驱的节点同层', () => {
    const layers = assignLayers(nodes, edges)
    expect(layers.get('start')).toBe(0)
    expect(layers.get('review')).toBe(1)
    expect(layers.get('audit')).toBe(2)
    expect(layers.get('end')).toBe(3)
  })

  it('取最长路径决定层号', () => {
    // start -> short -> end 与 start -> a -> b -> end 并存时，end 应在第 3 层
    const chain = [
      { id: 'start' },
      { id: 'short' },
      { id: 'a' },
      { id: 'b' },
      { id: 'end' },
    ]
    const chainEdges = [
      { source: 'start', target: 'short' },
      { source: 'short', target: 'end' },
      { source: 'start', target: 'a' },
      { source: 'a', target: 'b' },
      { source: 'b', target: 'end' },
    ]
    const layers = assignLayers(chain, chainEdges)
    expect(layers.get('end')).toBe(3)
    expect(layers.get('b')).toBe(2)
  })

  it('环上节点统一沉底，算法可终止', () => {
    const cyclicNodes = [{ id: 'root' }, { id: 'a' }, { id: 'b' }, { id: 'c' }]
    const cyclicEdges = [
      { source: 'root', target: 'a' },
      { source: 'a', target: 'b' },
      { source: 'b', target: 'a' },
      { source: 'root', target: 'c' },
    ]
    const layers = assignLayers(cyclicNodes, cyclicEdges)
    // c 正常分层在 root 下一层，a、b 在环上被追加到最后一层之后
    expect(layers.get('root')).toBe(0)
    expect(layers.get('c')).toBe(1)
    expect(layers.get('a')).toBeGreaterThan(layers.get('c')!)
    expect(layers.get('b')).toBe(layers.get('a'))
  })

  it('忽略自环与悬空连线', () => {
    const layers = assignLayers(
      [{ id: 'only' }],
      [
        { source: 'only', target: 'only' },
        { source: 'ghost', target: 'only' },
      ],
    )
    expect(layers.get('only')).toBe(0)
  })
})

describe('layoutByLayers', () => {
  it('LR 方向：层号映射 x，层内序号映射 y', () => {
    const positions = layoutByLayers(nodes, edges, {
      direction: 'LR',
      layerGap: 100,
      nodeGap: 40,
      nodeWidth: 100,
      nodeHeight: 40,
    })
    expect(positions.get('start')).toEqual({ x: 0, y: 0 })
    // 第二层 (review) 在 x=200，层内第一个 y=0
    expect(positions.get('review')).toEqual({ x: 200, y: 0 })
    expect(positions.get('end')).toEqual({ x: 600, y: 0 })
  })

  it('TB 方向：层号映射 y', () => {
    const positions = layoutByLayers(nodes, edges, { direction: 'TB', layerGap: 80, nodeWidth: 100, nodeHeight: 40 })
    expect(positions.get('start')).toEqual({ x: 0, y: 0 })
    expect(positions.get('audit')).toEqual({ x: 0, y: 2 * (40 + 80) })
  })

  it('同层多个节点沿垂直方向依次排列', () => {
    const same = [{ id: 'root' }, { id: 'x' }, { id: 'y' }, { id: 'z' }]
    const sameEdges = [
      { source: 'root', target: 'x' },
      { source: 'root', target: 'y' },
      { source: 'root', target: 'z' },
    ]
    const positions = layoutByLayers(same, sameEdges, { nodeGap: 20, nodeHeight: 40 })
    expect(positions.get('x')!.y).toBe(0)
    expect(positions.get('y')!.y).toBe(60)
    expect(positions.get('z')!.y).toBe(120)
  })
})
