const n=`// 命名空间与模块模式：理解 namespace 与 ES Module 的差异

// ── 命名空间（namespace）基础 ──
// namespace 是 TypeScript 早期的模块组织方式

namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean
  }

  export const lettersRegexp = /^[A-Za-z]+$/
  export const numberRegexp = /^[0-9]+$/

  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s)
    }
  }

  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s)
    }
  }
}

// 使用命名空间中的类型
const validators: { [key: string]: Validation.StringValidator } = {
  letters: new Validation.LettersOnlyValidator(),
  zip: new Validation.ZipCodeValidator(),
}

console.log(validators.letters.isAcceptable('Hello'))  // true
console.log(validators.zip.isAcceptable('12345'))      // true

// ── 命名空间的声明合并 ──
// 同名的 namespace 会自动合并

namespace Animals {
  export interface Dog {
    name: string
    breed: string
  }
}

namespace Animals {
  export interface Cat {
    name: string
    color: string
  }

  export function createDog(name: string, breed: string): Dog {
    return { name, breed }
  }
}

// 合并后 Animals 同时有 Dog、Cat 和 createDog
const dog = Animals.createDog('旺财', '柴犬')
const cat: Animals.Cat = { name: '咪咪', color: '橘色' }

// ── 命名空间与类合并 ──
// namespace 可以与 class 合并，为类添加静态成员

class Album {
  title: string
  artist: string

  constructor(title: string, artist: string) {
    this.title = title
    this.artist = artist
  }
}

namespace Album {
  export function create(title: string, artist: string): Album {
    return new Album(title, artist)
  }

  export const GENRES = ['rock', 'pop', 'jazz', 'classical'] as const
  export type Genre = typeof GENRES[number]
}

const album = Album.create('Thriller', 'Michael Jackson')
const genre: Album.Genre = 'pop'

// ── ES Module 方式（现代推荐） ──
// ES Module 是 JavaScript 标准，每个文件就是一个模块

// 导出
// export interface User {
//   id: number
//   name: string
// }
//
// export function getUser(id: number): User {
//   return { id, name: 'User ' + id }
// }
//
// export default class UserService {
//   get(id: number) {
//     return { id, name: 'User ' + id }
//   }
// }

// 导入
// import { User, getUser } from './user'
// import UserService from './user'
// import * as UserModule from './user'

// ── 命名空间 vs ES Module 对比 ──

// 命名空间：
// - TypeScript 特有语法
// - 运行时会生成一个全局对象
// - 支持声明合并
// - 适合在全局环境中组织代码（旧代码）
// - 不需要打包工具

// ES Module：
// - JavaScript 标准语法
// - 静态分析友好，支持 tree-shaking
// - 每个文件是独立作用域
// - 依赖关系明确
// - 现代项目推荐使用

// ── 命名空间的适用场景 ──
// 1. .d.ts 声明文件中组织类型
// 2. 旧代码维护
// 3. 全局环境中的类型组织

// 示例：在声明文件中用 namespace 组织类型
// declare namespace MyAPI {
//   interface User { id: number; name: string }
//   interface Order { id: string; userId: number }
//
//   function getUser(id: number): Promise<User>
//   function getOrders(userId: number): Promise<Order[]>
// }
//
// const user: MyAPI.User = { id: 1, name: 'Tom' }

// ── 别名简化命名空间访问 ──
// 用 import 别名简化深层命名空间访问

namespace Shapes {
  export namespace Polygons {
    export class Triangle {
      constructor(public base: number, public height: number) {}
      area() { return this.base * this.height / 2 }
    }
    export class Square {
      constructor(public side: number) {}
      area() { return this.side * this.side }
    }
  }
}

// 别名
import polygons = Shapes.Polygons

const tri = new polygons.Triangle(3, 4)
console.log(tri.area())  // 6

const sq = new polygons.Square(5)
console.log(sq.area())   // 25

console.log('命名空间演示完成')
`;export{n as default};
