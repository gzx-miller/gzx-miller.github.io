const t=`// 联合类型：限定变量只能取特定值
type OrderStatus = 'pending' | 'paid' | 'shipped'

// 控制流收窄：TS 根据条件自动缩窄类型
function getStatusText(status: OrderStatus): string {
  if (status === 'pending') return '待付款'
  if (status === 'paid') return '待发货'
  return '运输中'  // TS 知道此处只剩 'shipped'
}

// 非法状态在编译期即被拦截
// getStatusText('cancelled')  → 类型错误

const status: OrderStatus = 'pending'
console.log(getStatusText(status))  // 待付款
`;export{t as default};
