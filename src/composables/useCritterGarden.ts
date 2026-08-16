import { ref } from 'vue'

export interface GardenVec {
  x: number
  y: number
}

export interface SquirrelSubscriber {
  getRect: () => DOMRect | null
  onPrick: (hedgehogCenter: GardenVec) => void
}

export interface CollectibleSubscriber {
  getRect: () => DOMRect | null
  onStick: (hedgehogCenter: GardenVec) => void
}

/** 小刺猬的位置与移动模式（爬行 / 拖拽），供宝物粘连跟随 */
const hedgehogPos = ref<GardenVec>({ x: -1, y: -1 })
const hedgehogMode = ref<'idle' | 'crawl' | 'drag'>('idle')

let squirrelSub: SquirrelSubscriber | null = null
const collectibleSubs = new Map<string, CollectibleSubscriber>()

/**
 * 悬浮小花园共享状态：
 * 小刺猬在这里发布自己的位置，松鼠与宝物注册碰撞回调。
 */
export function useCritterGarden() {
  return {
    hedgehogPos,
    hedgehogMode,
    registerSquirrel(sub: SquirrelSubscriber) {
      squirrelSub = sub
    },
    unregisterSquirrel() {
      squirrelSub = null
    },
    registerCollectible(id: string, sub: CollectibleSubscriber) {
      collectibleSubs.set(id, sub)
    },
    unregisterCollectible(id: string) {
      collectibleSubs.delete(id)
    },
    getSquirrel: () => squirrelSub,
    forEachCollectible(fn: (sub: CollectibleSubscriber) => void) {
      collectibleSubs.forEach(fn)
    },
  }
}
