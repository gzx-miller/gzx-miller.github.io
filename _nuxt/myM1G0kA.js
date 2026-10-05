const n=`// 类型级编程：在类型层面实现计算和逻辑

// ── 类型级条件判断 ──
// 条件类型就是类型层面的 if-else

type If<C extends boolean, T, F> = C extends true ? T : F

type A = If<true, string, number>   // string
type B = If<false, string, number>  // number

// 比较大小（通过元组长度）
type SmallerThan<
  A extends number,
  B extends number,
  Count extends any[] = []
> = Count['length'] extends A
  ? true
  : Count['length'] extends B
    ? false
    : SmallerThan<A, B, [...Count, 0]>

type S1 = SmallerThan<3, 5>  // true
type S2 = SmallerThan<5, 3>  // false
type S3 = SmallerThan<5, 5>  // false

// ── 类型级循环：递归 ──
// 用递归实现类型层面的循环

// 重复字符串类型
type RepeatString<
  S extends string,
  N extends number,
  Count extends any[] = [],
  Result extends string = ''
> = Count['length'] extends N
  ? Result
  : RepeatString<S, N, [...Count, 0], \`\${Result}\${S}\`>

type Hello3 = RepeatString<'hello', 3>  // 'hellohellohello'
type Dash5 = RepeatString<'-', 5>        // '-----'

// ── 元组操作 ──
// 类型层面的元组操作

// 元组长度
type Length<T extends any[]> = T['length']

type L1 = Length<[1, 2, 3]>  // 3
type L2 = Length<[]>          // 0

// 元组头部
type Head<T extends any[]> = T extends [infer H, ...infer _] ? H : never

type H1 = Head<[string, number, boolean]>  // string

// 元组尾部
type Tail<T extends any[]> = T extends [infer _, ...infer R] ? R : never

type T1 = Tail<[string, number, boolean]>  // [number, boolean]

// 元组拼接
type Concat<A extends any[], B extends any[]> = [...A, ...B]

type C1 = Concat<[1, 2], [3, 4]>  // [1, 2, 3, 4]

// ── 类型级 Fibonacci ──
// 通过元组长度实现斐波那契

type Fibonacci<
  N extends number,
  Prev extends any[] = [],
  Curr extends any[] = [0],
  Index extends any[] = [0]
> = Index['length'] extends N
  ? Curr['length']
  : Fibonacci<N, Curr, [...Prev, ...Curr], [...Index, 0]>

type F0 = Fibonacci<0>  // 1
type F1 = Fibonacci<1>  // 1
type F2 = Fibonacci<2>  // 2
type F3 = Fibonacci<3>  // 3
type F5 = Fibonacci<5>  // 8
type F7 = Fibonacci<7>  // 21

// ── 字符串操作：类型级 trim ──

// 去除左侧空格
type TrimLeft<S extends string> = S extends \` \${infer R}\` ? TrimLeft<R> : S

type TL1 = TrimLeft<'  hello'>  // 'hello'

// 去除右侧空格
type TrimRight<S extends string> = S extends \`\${infer L} \` ? TrimRight<L> : S

type TR1 = TrimRight<'hello  '>  // 'hello'

// 去除两侧空格
type Trim<S extends string> = TrimLeft<TrimRight<S>>

type TTrim = Trim<'  hello world  '>  // 'hello world'

// ── 字符串转大写下划线 ──

type KebabCase<S extends string> = S extends \`\${infer First}\${infer Rest}\`
  ? First extends Uppercase<First>
    ? First extends Lowercase<First>
      ? \`\${First}\${KebabCase<Rest>}\`
      : \`-\${Lowercase<First>}\${KebabCase<Rest>}\`
    : \`\${First}\${KebabCase<Rest>}\`
  : S

type Kebab1 = KebabCase<'HelloWorld'>    // '-hello-world'
type Kebab2 = KebabCase<'getUserName'>   // 'get-user-name'

// 驼峰转下划线
type SnakeCase<S extends string> = S extends \`\${infer First}\${infer Rest}\`
  ? First extends Uppercase<First>
    ? First extends Lowercase<First>
      ? \`\${First}\${SnakeCase<Rest>}\`
      : \`_\${Lowercase<First>}\${SnakeCase<Rest>}\`
    : \`\${First}\${SnakeCase<Rest>}\`
  : S

type Snake1 = SnakeCase<'HelloWorld'>    // '_hello_world'
type Snake2 = SnakeCase<'getUserName'>   // 'get_user_name'

// ── 对象键转换 ──
// 将对象的所有键转换为指定格式

type DeepKebabKeys<T> = T extends object
  ? {
      [K in keyof T as KebabCase<string & K>]: DeepKebabKeys<T[K]>
    }
  : T

interface UserSettings {
  userName: string
  avatarUrl: string
  notificationSettings: {
    emailNotification: boolean
    pushNotification: boolean
    smsNotification: boolean
  }
}

type KebabSettings = DeepKebabKeys<UserSettings>
// {
//   'user-name': string
//   'avatar-url': string
//   'notification-settings': {
//     'email-notification': boolean
//     'push-notification': boolean
//     'sms-notification': boolean
//   }
// }

// ── 类型级 ParseInt ──
// 字符串数字转数字类型

type ParseInt<S extends string, Acc extends any[] = []> = S extends \`\${Acc['length']}\`
  ? Acc['length']
  : ParseInt<S, [...Acc, 0]>

type P1 = ParseInt<'5'>   // 5
type P2 = ParseInt<'10'>  // 10（受递归深度限制，大数可能不行）

// ── 联合类型转交叉类型 ──

type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never

type U2I = UnionToIntersection<{ a: 1 } | { b: 2 }>  // { a: 1 } & { b: 2 }

// ── 获取联合类型的最后一个成员 ──

type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => infer R
    ? R
    : never

type Last = LastOf<'a' | 'b' | 'c'>  // 'c'

// ── 联合类型转元组 ──

type UnionToTuple<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
  true extends N
    ? []
    : [...UnionToTuple<Exclude<T, L>>, L]

type UTT = UnionToTuple<'a' | 'b' | 'c'>  // ['a', 'b', 'c']

console.log('类型级编程演示完成')
`;export{n as default};
