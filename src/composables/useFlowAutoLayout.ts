/**
 * 分层自动布局：为 Vue Flow 的节点计算整齐的层级坐标。
 *
 * 算法思路（Kahn 分层）：
 * 1. 以连线 source -> target 建图，统计每个节点的入度。
 * 2. 入度为 0 的节点作为第一层，逐层向下推进。
 * 3. 节点所在层 = 所有前置节点层的最大值 + 1，保证父节点永远在子节点左侧（或上方）。
 * 4. 环上节点永远凑不齐入度，统一追加到最后一层，保证算法可终止。
 */

export interface LayoutNodeLike {
  id: string
}

export interface LayoutEdgeLike {
  source: string
  target: string
}

export interface XYPosition {
  x: number
  y: number
}

export interface FlowLayoutOptions {
  /** 布局方向：LR 从左到右分层，TB 从上到下分层 */
  direction?: 'LR' | 'TB'
  /** 层与层之间的间距（沿布局方向） */
  layerGap?: number
  /** 同层节点之间的间距（垂直于布局方向） */
  nodeGap?: number
  /** 节点占据的宽高，用于计算同层堆叠步长 */
  nodeWidth?: number
  nodeHeight?: number
}

const DEFAULT_OPTIONS: Required<FlowLayoutOptions> = {
  direction: 'LR',
  layerGap: 90,
  nodeGap: 24,
  nodeWidth: 150,
  nodeHeight: 40,
}

/** 计算每个节点所在的层号（从 0 开始），返回 id -> layer 映射 */
export function assignLayers(
  nodes: LayoutNodeLike[],
  edges: LayoutEdgeLike[],
): Map<string, number> {
  const layers = new Map<string, number>()
  const indegree = new Map<string, number>()
  const outgoing = new Map<string, string[]>()

  for (const node of nodes) {
    layers.set(node.id, 0)
    indegree.set(node.id, 0)
    outgoing.set(node.id, [])
  }

  for (const edge of edges) {
    // 忽略指向不存在节点的连线与自环
    if (!indegree.has(edge.source) || !indegree.has(edge.target)) continue
    if (edge.source === edge.target) continue
    outgoing.get(edge.source)!.push(edge.target)
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1)
  }

  // Kahn 队列：入度为 0 的节点起步
  const queue = nodes.filter((node) => (indegree.get(node.id) ?? 0) === 0).map((n) => n.id)
  const remaining = new Map(indegree)

  while (queue.length > 0) {
    const current = queue.shift()!
    const currentLayer = layers.get(current) ?? 0
    for (const next of outgoing.get(current) ?? []) {
      // 后继节点层号至少比当前节点大 1
      layers.set(next, Math.max(layers.get(next) ?? 0, currentLayer + 1))
      const left = (remaining.get(next) ?? 1) - 1
      remaining.set(next, left)
      if (left === 0) queue.push(next)
    }
  }

  // 环上节点：统一沉到最后一层之后
  const cyclic = [...remaining.entries()].filter(([, left]) => left > 0).map(([id]) => id)
  if (cyclic.length > 0) {
    const maxLayer = Math.max(0, ...layers.values())
    for (const id of cyclic) layers.set(id, maxLayer + 1)
  }

  return layers
}

/** 按层级计算每个节点的坐标，返回 id -> position 映射 */
export function layoutByLayers(
  nodes: LayoutNodeLike[],
  edges: LayoutEdgeLike[],
  options: FlowLayoutOptions = {},
): Map<string, XYPosition> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const layers = assignLayers(nodes, edges)
  const positions = new Map<string, XYPosition>()

  // 每层内部的序号（按节点在数组中的出现顺序，保证结果稳定）
  const indexInLayer = new Map<number, number>()

  for (const node of nodes) {
    const layer = layers.get(node.id) ?? 0
    const index = indexInLayer.get(layer) ?? 0
    indexInLayer.set(layer, index + 1)

    // 主轴（沿分层方向）用层号推进，副轴（层内堆叠方向）用序号推进
    const alongSize = opts.direction === 'LR' ? opts.nodeWidth : opts.nodeHeight
    const crossSize = opts.direction === 'LR' ? opts.nodeHeight : opts.nodeWidth
    const depth = layer * (alongSize + opts.layerGap)
    const offset = index * (crossSize + opts.nodeGap)

    if (opts.direction === 'LR') {
      positions.set(node.id, { x: depth, y: offset })
    } else {
      positions.set(node.id, { x: offset, y: depth })
    }
  }

  return positions
}
