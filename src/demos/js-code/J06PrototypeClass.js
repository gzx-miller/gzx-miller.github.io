// class 是原型继承的语法封装
class Course {
  constructor(title, hours) {
    this.title = title
    this.hours = hours
  }

  summary() {
    return `${this.title} · ${this.hours} 小时`
  }
}

// extends 建立原型链，super 调用父类方法
class LiveCourse extends Course {
  summary() {
    return `直播课：${super.summary()}`
  }
}

const course = new LiveCourse('异步编程', 6)
console.log(course.summary())  // 直播课：异步编程 · 6 小时

// 实例方法定义在 prototype 上，所有实例共享
console.log(course.summary === new LiveCourse('测试', 1).summary)  // true
