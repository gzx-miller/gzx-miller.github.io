const n=`// this 的指向取决于函数的调用方式
const teacher = {
  name: '松松',
  introduce() {
    return \`讲师：\${this.name}\`
  },
}

// 方法调用：this 指向调用者
console.log(teacher.introduce())  // 讲师：松松

// 脱离对象后调用：this 丢失（严格模式下为 undefined）
const detached = teacher.introduce
// detached()  → TypeError（严格模式）或 '讲师：undefined'

// 使用 .call() 显式绑定 this
console.log(detached.call({ name: '临时讲师' }))  // 讲师：临时讲师
`;export{n as default};
