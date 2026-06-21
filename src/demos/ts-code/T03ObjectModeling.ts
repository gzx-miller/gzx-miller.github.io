// interface 定义领域对象的结构契约
interface MemberProfile {
  name: string
  level: '普通' | '银卡' | '金卡'
  points: number
}

// 创建对象时必须满足接口定义
const member: MemberProfile = {
  name: '小栗',
  level: '银卡',
  points: 860,
}

// 基于接口计算衍生值
function getUpgradeGap(m: MemberProfile): number {
  return Math.max(0, 1000 - m.points)
}

console.log(`${member.name} · ${member.level}会员`)
console.log(`还差 ${getUpgradeGap(member)} 分升级`)
