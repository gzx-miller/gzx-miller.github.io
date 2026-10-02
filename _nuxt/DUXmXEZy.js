const e=`// 可辨识联合类型：通过判别属性区分联合成员，配合穷尽性检查

// ── 基础可辨识联合 ──
// 每个接口都有一个相同名字的字面量类型属性（判别属性）

interface Circle {
  kind: 'circle'  // 判别属性：字面量类型
  radius: number
}

interface Square {
  kind: 'square'  // 判别属性
  side: number
}

interface Rectangle {
  kind: 'rectangle'  // 判别属性
  width: number
  height: number
}

// 组成联合类型
type Shape = Circle | Square | Rectangle

// 根据判别属性收窄类型
function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      // shape 收窄为 Circle
      return Math.PI * shape.radius ** 2
    case 'square':
      // shape 收窄为 Square
      return shape.side ** 2
    case 'rectangle':
      // shape 收窄为 Rectangle
      return shape.width * shape.height
  }
}

const circle: Shape = { kind: 'circle', radius: 5 }
const square: Shape = { kind: 'square', side: 4 }
console.log(getArea(circle))  // 78.5398...
console.log(getArea(square))  // 16

// ── 穷尽性检查：never 类型 ──
// 在 default 分支中赋值给 never 类型，新增成员时编译期报错

function getAreaExhaustive(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.side ** 2
    case 'rectangle':
      return shape.width * shape.height
    default:
      // 如果有遗漏的 case，这里会编译报错
      // 因为 shape 不可能是 never
      const _exhaustiveCheck: never = shape
      return _exhaustiveCheck
  }
}

// 新增 Triangle 类型后，上面的函数会编译报错，提醒补充 case
// interface Triangle {
//   kind: 'triangle'
//   base: number
//   height: number
// }
// type Shape2 = Shape | Triangle  // 新增后 getAreaExhaustive 会报错

// ── 实用场景：订单状态机 ──

interface PendingOrder {
  status: 'pending'
  orderId: string
  createTime: number
}

interface PaidOrder {
  status: 'paid'
  orderId: string
  paidTime: number
  payMethod: 'alipay' | 'wechat' | 'card'
}

interface ShippedOrder {
  status: 'shipped'
  orderId: string
  shippedTime: number
  trackingNo: string
}

interface CompletedOrder {
  status: 'completed'
  orderId: string
  completedTime: number
}

interface CancelledOrder {
  status: 'cancelled'
  orderId: string
  cancelReason: string
  cancelTime: number
}

type Order = PendingOrder | PaidOrder | ShippedOrder | CompletedOrder | CancelledOrder

// 处理不同状态的订单
function processOrder(order: Order): string {
  switch (order.status) {
    case 'pending':
      return \`订单 \${order.orderId} 待支付，创建于 \${order.createTime}\`
    case 'paid':
      return \`订单 \${order.orderId} 已支付，支付方式：\${order.payMethod}\`
    case 'shipped':
      return \`订单 \${order.orderId} 已发货，物流单号：\${order.trackingNo}\`
    case 'completed':
      return \`订单 \${order.orderId} 已完成\`
    case 'cancelled':
      return \`订单 \${order.orderId} 已取消，原因：\${order.cancelReason}\`
    default:
      const _exhaustive: never = order
      return _exhaustive
  }
}

const order: Order = {
  status: 'paid',
  orderId: 'ORD-001',
  paidTime: Date.now(),
  payMethod: 'alipay',
}
console.log(processOrder(order))

// ── 实用场景：消息/事件类型 ──

interface TextMessage {
  type: 'text'
  content: string
}

interface ImageMessage {
  type: 'image'
  url: string
  width: number
  height: number
}

interface VoiceMessage {
  type: 'voice'
  url: string
  duration: number
}

type Message = TextMessage | ImageMessage | VoiceMessage

function renderMessage(msg: Message): string {
  switch (msg.type) {
    case 'text':
      return \`[文本] \${msg.content}\`
    case 'image':
      return \`[图片] \${msg.url} (\${msg.width}x\${msg.height})\`
    case 'voice':
      return \`[语音] \${msg.url} (\${msg.duration}秒)\`
  }
}

// ── 用 if/in 收窄 ──
// 不只是 switch，if 结合 in 操作符也可以收窄

function getShapeInfo(shape: Shape): string {
  if ('radius' in shape) {
    // 有 radius 属性 → Circle
    return \`圆形，半径 \${shape.radius}\`
  } else if ('side' in shape) {
    // 有 side 属性 → Square
    return \`正方形，边长 \${shape.side}\`
  } else {
    // 剩下的就是 Rectangle
    return \`长方形，宽 \${shape.width}，高 \${shape.height}\`
  }
}

// ── 可辨识联合 + 类型守卫 ──

function isCircle(shape: Shape): shape is Circle {
  return shape.kind === 'circle'
}

const shapes: Shape[] = [
  { kind: 'circle', radius: 3 },
  { kind: 'square', side: 2 },
  { kind: 'circle', radius: 5 },
]

// 过滤出所有圆形
const circles = shapes.filter(isCircle)
// circles 类型为 Circle[]

console.log('可辨识联合演示完成')
`;export{e as default};
